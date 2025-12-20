"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FeedbackSection = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);

        const res = await fetch("/api/feedback", {
            method: "POST",
            body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message"),
            }),
        });

        setLoading(false);

        if (res.ok) {
            e.currentTarget.reset();
            setSuccess(true);
        }
    };

    return (
        <section id="feedback-section" className="w-full py-24">
            <div className="container mx-auto px-6 max-w-3xl">

                {/* TITLE */}
                <h2 className="font-roster text-3xl md:text-4xl mb-10 text-center">
                    Send Us Feedback
                </h2>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 font-retro"
                >
                    <Input
                        name="name"
                        placeholder="Your Name"
                        required
                    />

                    <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        required
                    />

                    <Textarea
                        name="message"
                        placeholder="Your Message"
                        rows={5}
                        required
                    />

                    {/* RETRO BUTTON */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-40 h-12 cursor-pointer group disabled:opacity-60"
                        >
                            <div className="absolute w-40 h-12 bg-black rounded-sm"></div>
                            <div
                                className="
                  absolute w-40 h-12 bg-navy z-10
                  -translate-x-1.5 -translate-y-1.5
                  rounded-sm flex items-center justify-center
                  border-4 border-black
                  transition-transform
                  group-hover:translate-x-0 group-hover:translate-y-0
                  active:translate-x-0 active:translate-y-0
                "
                            >
                                <span className="text-white font-bold text-lg">
                                    {loading ? "Sending..." : "Send Message"}
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* SUCCESS MESSAGE */}
                    {success && (
                        <p className="text-green text-center font-bold">
                            Message sent successfully!
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
};

export default FeedbackSection;

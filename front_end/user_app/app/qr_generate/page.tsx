import VotingTokenCard from "@/components/ui/VotingTokenCard";
import SecurityScanner from "@/components/ui/SecurityScanner";

export default function GenerateQr() {
  // Mode: "USER" (Lihat Token) atau "ADMIN" (Scan Token)
  const mode = "USER"; 

  return (
    <div className="min-h-screen bg-[#fdf8f4] py-20 px-4">
      
      <div className="text-center mb-10">
        <h1 className="font-roster text-4xl mb-2">Voting Area</h1>
        <p className="font-mono text-gray-600">Scan token anda untuk memilih.</p>
      </div>

      <VotingTokenCard 
          tokenString="A82-X99-SECURE-TOKEN" 
          userName="Raihan Tri Rizqi" 
          userNIM="125140125"
      />
    </div>
  );
}
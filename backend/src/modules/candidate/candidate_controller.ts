import { CandidateService } from "./candidate_service";

export class CandidateController {
  public constructor(
    private readonly service: CandidateService,
    private readonly prefix = "/candidates",
  ) {}

  public register = () => {};
}

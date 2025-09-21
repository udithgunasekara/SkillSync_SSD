import { createContext } from "react";


//define type 
type FreelancerContextType = {
      freelancerCon: string,
      setFreelancerCon: React.Dispatch<React.SetStateAction<string>>
      freelancerEmail:string,
      setFreelancerEmail: React.Dispatch<React.SetStateAction<string>>
      

}


const FreelancerContext = createContext<FreelancerContextType|undefined>(undefined);
export default FreelancerContext;  

// export const FreelancerContext = createContext<Freelancer | undefined>(undefined);

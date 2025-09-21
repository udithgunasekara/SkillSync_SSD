import React, { useState } from "react";

import FreelancerContext from "./Context";

//this is the wrapper

const FreelancerContextProvider = ({children}:any) => { //just a simple method

      const [freelancerCon, setFreelancerCon] = useState<string>("");//this data should access the all component
      const [freelancerEmail, setFreelancerEmail] = useState<string>("");
      return (
            <FreelancerContext.Provider value={{freelancerCon, setFreelancerCon, freelancerEmail, setFreelancerEmail}}>
                  {children}
            </FreelancerContext.Provider>
      )
}
export default FreelancerContextProvider;
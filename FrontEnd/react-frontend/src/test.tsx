

// export default function test() {
//   return (
//     <div>test</div>
//   )
// }

// import React from 'react'

// function testt() {

//       useEffect(() => {
//             console.log("Component mount");
//       }, []);
    
//   return (
//     <div>test</div>
//   )
// }

// export default testt

import React, {useEffect} from 'react'

export const test = () => {

      type status = "close" | "Open" | "OpenClose"; //can we only one of the tree values we called it as Union type

      useEffect(() => {
            console.log("Componet Mount");

            //when unmount
            return () =>{
                  console.log("Component is unmount")
            }



      }, []);

    


  return (
    <div>test</div>
  )
}


export interface ISteps {
  id: string;
  message: string;
}
const steps: ISteps[] = [
  {
    id: "name",
    message:
      " Welcome to Alexis! To get started, please enter your name . ",
  },
  {
    id: "dateOfBirth",
    message:
      " Could you tell us your date of birth? This helps us know you better !",
  },
  {
    id: "studyField",
    message:
      "Great! Now, what is your field of study ? We would love to curate specific courses and content that will strike your fancy.",
  },
  {
    id: "university",
    message:
      "Almost done ! Which university are you attending? We will use this info to provide resources relevant to your institution.",
  },  {
    id: "complete",
    message:
      "That is it! You are all set to explore everything Alexis has to offer. Happy studying !"
  },

];

export default steps;

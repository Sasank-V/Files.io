import { useContext } from "react";
import SubjectContext from "@/context/SubjectProvider";

const useSubjects = () => {
    return useContext(SubjectContext);
}

export default useSubjects;
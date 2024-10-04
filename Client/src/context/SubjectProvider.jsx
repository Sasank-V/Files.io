import { createContext, useState } from "react"

const SubjectContext = createContext({})

export const SubjectProvider = ({ children }) => {
    const [subjects, setSubjects] = useState([]);

    return (
        <SubjectContext.Provider value={{ subjects, setSubjects }}>
            {children}
        </SubjectContext.Provider>
    )
}

export default SubjectContext


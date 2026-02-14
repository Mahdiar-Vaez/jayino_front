import React, { useState } from "react"
type Fields=Record<string,string>
export  default function useFormFields(initialValues:Fields) {
    const [fields,setFields]=useState<Fields>(initialValues)
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void=>{
        const { name, value } = e.target
        setFields((prev)=>( {...prev,[name]:value}))
    }

    return {handleChange,fields}

} 
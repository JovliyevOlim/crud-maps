import * as Yup from "yup";

export const userSchema = Yup.object().shape({
    firstName: Yup.string().min(3, "At least 3 characters").required("First name is required"),
    lastName: Yup.string().min(3, "At least 3 characters").required("Last name is required"),
    gender: Yup.string().oneOf(["male", "female"]).required("Gender is required"),
    birthdate: Yup.date().required("Birthdate is required"),
});

export type UserFormValues = {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    birthdate: string;
    id?:number;
};
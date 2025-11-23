import {Formik, Form, Field, ErrorMessage} from "formik";
import {userSchema, type UserFormValues} from "@/types/user.types";
import {useUsersStore} from "@/store/users.store";
import {useModalStore} from "@/store/modal.store";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {DatePicker} from "@/components/DatePicker";
import {useToast} from "@/hooks/use-toast";

export function UserFormModal() {
    const {formModalOpen, closeFormModal, editingUserId} = useModalStore();
    const {users, addUser, updateUser} = useUsersStore();
    const {toast} = useToast()

    const defaultValues: UserFormValues = editingUserId
        ? users.find(u => u.id === editingUserId) || {firstName: "", lastName: "", gender: "male", birthdate: ""}
        : {firstName: "", lastName: "", gender: "male", birthdate: ""};

    return (
        <Dialog open={formModalOpen} onOpenChange={closeFormModal}>
            <DialogContent className="sm:max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle>{editingUserId ? " Edit User" : " Create User"}</DialogTitle>
                </DialogHeader>
                <Formik
                    enableReinitialize
                    initialValues={defaultValues}
                    validationSchema={userSchema}
                    onSubmit={async (values, {setSubmitting}) => {
                        await new Promise((resolve) => setTimeout(resolve, 800));
                        try {
                            setSubmitting(true)
                            if (editingUserId) {
                                await updateUser(editingUserId, values)
                                toast({description: "User updated successfully!", variant: "success"})
                            } else {
                                await addUser(values)
                                toast({description: "User created successfully!", variant: "success"})
                            }
                            closeFormModal()
                        } catch (err) {
                            toast({description: "Something went wrong!",})
                            console.error(err)
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({values, setFieldValue, isSubmitting}) => (
                        <Form className="space-y-4">
                            <div>
                                <Field name="firstName" as={Input} placeholder="First Name"/>
                                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm"/>
                            </div>
                            <div>
                                <Field name="lastName" as={Input} placeholder="Last Name"/>
                                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm"/>
                            </div>
                            <div>
                                <Field name="birthdate">
                                    {({field, form}: any) => (
                                        <div>
                                            <DatePicker
                                                data={field.value ? new Date(field.value) : undefined}
                                                handleChange={(date: Date | undefined) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        date ? date.toISOString().split("T")[0] : ""
                                                    )
                                                }}
                                            />
                                            <ErrorMessage
                                                name="birthdate"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                    )}
                                </Field>
                            </div>

                            <RadioGroup value={values.gender} onValueChange={val => setFieldValue("gender", val)}>
                                <div className="flex space-x-4">
                                    <RadioGroupItem value="male" id="male"/>
                                    <Label htmlFor="male">Male</Label>
                                    <RadioGroupItem value="female" id="female"/>
                                    <Label htmlFor="female">Female</Label>
                                </div>
                            </RadioGroup>
                            <ErrorMessage name="gender" component="div" className="text-red-500 text-sm"/>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={closeFormModal}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}
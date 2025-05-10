"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useRouter } from "next/navigation" // Corrected import

type FormType = 'sign-in' | 'sign-up'

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter() // Initialize router correctly

    const formSchema = z.object({
        ...(type === 'sign-up' && {
            name: z.string().min(2, "Name must be at least 2 characters")
        }),
        email: z.string().email("Invalid email"),
        password: z.string().min(8, "Password must be at least 8 characters")
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...(type === 'sign-up' && { name: "" }),
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (type === "sign-up") {
                // Add your sign-up API call here
                toast.success("Account created successfully. Please sign in.")
                router.push('/sign-in')
            } else {
                // Add your sign-in API call here
                toast.success("Signed in successfully")
                router.push('/')
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred")
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm">
            <div className="flex flex-col items-center mb-6">
                <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
                <h1 className="text-2xl font-bold mt-2">
                    {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {type === 'sign-up' && (
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="email@example.com"
                                        {...field}
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        {type === 'sign-in' ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>
            </Form>

            <p className="mt-4 text-center text-sm">
                {type === 'sign-in' ? (
                    <>Don't have an account? <Link href="/sign-up" className="font-medium text-primary hover:underline">Sign up</Link></>
                ) : (
                    <>Already have an account? <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link></>
                )}
            </p>
        </div>
    )
}

export default AuthForm
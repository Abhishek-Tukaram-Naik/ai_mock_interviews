import React from 'react'
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form'
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface FormFieldProps<T extends FieldValues> extends UseControllerProps<T> {
    label: string
    placeholder?: string
    type?: string
    description?: string
}

const FormField = <T extends FieldValues>({
                                              control,
                                              name,
                                              label,
                                              placeholder = '',
                                              type = 'text',
                                              description,
                                              ...props
                                          }: FormFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type={type}
                            {...field}
                            {...props}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage>{error?.message}</FormMessage>
                </FormItem>
            )}
        />
    )
}

export default FormField
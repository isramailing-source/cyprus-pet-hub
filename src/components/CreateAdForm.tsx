import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdFormValidation } from "@/hooks/useFormValidation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationErrorsProps {
  errors: string[];
  show: boolean;
}

function ValidationErrors({ errors, show }: ValidationErrorsProps) {
  if (!show || errors.length === 0) return null;
  
  return (
    <div className="mt-1 space-y-1">
      {errors.map((error, index) => (
        <Alert key={index} variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  errors: string[];
  showErrors: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  children?: React.ReactNode;
}

function FormField({
  label,
  name,
  required = false,
  type = "text",
  placeholder,
  value,
  errors,
  showErrors,
  onChange,
  onBlur,
  children
}: FormFieldProps) {
  const hasErrors = showErrors && errors.length > 0;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={cn(
        "text-sm font-medium",
        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        hasErrors && "text-red-600"
      )}>
        {label}
      </Label>
      
      {children || (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            hasErrors && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
      )}
      
      <ValidationErrors errors={errors} show={showErrors} />
    </div>
  );
}

interface TextareaFieldProps extends Omit<FormFieldProps, 'children'> {
  rows?: number;
}

function TextareaField({
  label,
  name,
  required = false,
  placeholder,
  value,
  errors,
  showErrors,
  onChange,
  onBlur,
  rows = 4
}: TextareaFieldProps) {
  const hasErrors = showErrors && errors.length > 0;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={cn(
        "text-sm font-medium",
        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        hasErrors && "text-red-600"
      )}>
        {label}
      </Label>
      
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        className={cn(
          hasErrors && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />
      
      <ValidationErrors errors={errors} show={showErrors} />
    </div>
  );
}

interface SelectFieldProps extends Omit<FormFieldProps, 'children' | 'type' | 'placeholder'> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

function SelectField({
  label,
  name,
  required = false,
  placeholder = "Select an option",
  value,
  errors,
  showErrors,
  onChange,
  onBlur,
  options
}: SelectFieldProps) {
  const hasErrors = showErrors && errors.length > 0;
  
  return (
    <div className="space-y-2">
      <Label className={cn(
        "text-sm font-medium",
        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        hasErrors && "text-red-600"
      )}>
        {label}
      </Label>
      
      <Select value={value} onValueChange={onChange} onOpenChange={(open) => !open && onBlur()}>
        <SelectTrigger className={cn(
          hasErrors && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <ValidationErrors errors={errors} show={showErrors} />
    </div>
  );
}

export const CreateAdForm = () => {
  const { user } = useAuth();
  const validation = useAdFormValidation({
    title: "",
    description: "",
    price: "",
    location: "",
    breed: "",
    age: "",
    gender: "",
    phone: "",
    email: user?.email || "",
  });

  const {
    data,
    updateField,
    handleBlur,
    getFieldValidation,
    handleSubmit,
    isSubmitting,
    reset
  } = validation;

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Post Your Pet Ad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to create your pet advertisement.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const submitForm = async (sanitizedData: Record<string, string>) => {
    const { error } = await supabase
      .from('ads')
      .insert({
        title: sanitizedData.title,
        description: sanitizedData.description,
        price: sanitizedData.price ? parseFloat(sanitizedData.price) : null,
        location: sanitizedData.location || null,
        breed: sanitizedData.breed || null,
        age: sanitizedData.age || null,
        gender: sanitizedData.gender || null,
        phone: sanitizedData.phone || null,
        email: sanitizedData.email || user.email,
        source_name: 'User Submitted',
        source_url: window.location.origin,
        images: [], // TODO: Add image upload functionality
        user_id: user.id,
      });

    if (error) {
      throw new Error(error.message);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(submitForm, {
      successMessage: "Your pet ad has been submitted and is pending approval."
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Post Your Pet Ad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Title"
                name="title"
                required
                placeholder="Beautiful Golden Retriever Puppy"
                value={data.title}
                errors={getFieldValidation('title').errors}
                showErrors={getFieldValidation('title').touched}
                onChange={(value) => updateField('title', value)}
                onBlur={() => handleBlur('title')}
              />
            </div>

            <FormField
              label="Breed"
              name="breed"
              placeholder="Golden Retriever"
              value={data.breed}
              errors={getFieldValidation('breed').errors}
              showErrors={getFieldValidation('breed').touched}
              onChange={(value) => updateField('breed', value)}
              onBlur={() => handleBlur('breed')}
            />

            <FormField
              label="Price (€)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="500"
              value={data.price}
              errors={getFieldValidation('price').errors}
              showErrors={getFieldValidation('price').touched}
              onChange={(value) => updateField('price', value)}
              onBlur={() => handleBlur('price')}
            />

            <FormField
              label="Location"
              name="location"
              placeholder="Nicosia, Cyprus"
              value={data.location}
              errors={getFieldValidation('location').errors}
              showErrors={getFieldValidation('location').touched}
              onChange={(value) => updateField('location', value)}
              onBlur={() => handleBlur('location')}
            />

            <SelectField
              label="Age"
              name="age"
              placeholder="Select age range"
              value={data.age}
              errors={getFieldValidation('age').errors}
              showErrors={getFieldValidation('age').touched}
              onChange={(value) => updateField('age', value)}
              onBlur={() => handleBlur('age')}
              options={[
                { value: "puppy", label: "Puppy (0-1 year)" },
                { value: "young", label: "Young (1-3 years)" },
                { value: "adult", label: "Adult (3-7 years)" },
                { value: "senior", label: "Senior (7+ years)" }
              ]}
            />

            <SelectField
              label="Gender"
              name="gender"
              placeholder="Select gender"
              value={data.gender}
              errors={getFieldValidation('gender').errors}
              showErrors={getFieldValidation('gender').touched}
              onChange={(value) => updateField('gender', value)}
              onBlur={() => handleBlur('gender')}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" }
              ]}
            />

            <FormField
              label="Phone"
              name="phone"
              type="tel"
              placeholder="+357 99 123456"
              value={data.phone}
              errors={getFieldValidation('phone').errors}
              showErrors={getFieldValidation('phone').touched}
              onChange={(value) => updateField('phone', value)}
              onBlur={() => handleBlur('phone')}
            />

            <FormField
              label="Email"
              name="email"
              required
              type="email"
              placeholder="your@email.com"
              value={data.email}
              errors={getFieldValidation('email').errors}
              showErrors={getFieldValidation('email').touched}
              onChange={(value) => updateField('email', value)}
              onBlur={() => handleBlur('email')}
            />
          </div>

          <div className="md:col-span-2">
            <TextareaField
              label="Description"
              name="description"
              required
              placeholder="Describe your pet, its personality, health status, and any special requirements..."
              value={data.description}
              errors={getFieldValidation('description').errors}
              showErrors={getFieldValidation('description').touched}
              onChange={(value) => updateField('description', value)}
              onBlur={() => handleBlur('description')}
              rows={6}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            
            <div className="space-x-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Submitting..." : "Submit Ad"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

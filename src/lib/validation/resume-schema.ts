import { z } from 'zod';

/**
 * Validation schemas for resume data
 * Uses Zod for type-safe runtime validation
 */

// Personal Information Schema
export const PersonalInfoSchema = z.object({
    firstName: z.string()
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters'),
    lastName: z.string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    phone: z.string()
        .min(1, 'Phone number is required')
        .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
    location: z.string()
        .max(100, 'Location must be less than 100 characters')
        .optional(),
    linkedin: z.string()
        .url('Please enter a valid LinkedIn URL')
        .optional()
        .or(z.literal('')),
    website: z.string()
        .url('Please enter a valid website URL')
        .optional()
        .or(z.literal('')),
    summary: z.string()
        .max(500, 'Summary must be less than 500 characters')
        .optional(),
});

// Work Experience Schema
export const WorkExperienceSchema = z.object({
    id: z.string(),
    company: z.string()
        .min(1, 'Company name is required')
        .max(100, 'Company name must be less than 100 characters'),
    position: z.string()
        .min(1, 'Position title is required')
        .max(100, 'Position title must be less than 100 characters'),
    location: z.string()
        .max(100, 'Location must be less than 100 characters')
        .optional(),
    startDate: z.string()
        .min(1, 'Start date is required')
        .regex(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
    endDate: z.string()
        .regex(/^\d{4}-\d{2}$/, 'End date must be in YYYY-MM format')
        .optional()
        .or(z.literal('')),
    current: z.boolean(),
    achievements: z.array(z.string())
        .min(1, 'Add at least one achievement')
        .max(10, 'Maximum 10 achievements allowed'),
});

// Education Schema
export const EducationSchema = z.object({
    id: z.string(),
    school: z.string()
        .min(1, 'School name is required')
        .max(100, 'School name must be less than 100 characters'),
    degree: z.string()
        .min(1, 'Degree is required')
        .max(100, 'Degree must be less than 100 characters'),
    field: z.string()
        .max(100, 'Field of study must be less than 100 characters')
        .optional(),
    location: z.string()
        .max(100, 'Location must be less than 100 characters')
        .optional(),
    startDate: z.string()
        .min(1, 'Start date is required')
        .regex(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
    endDate: z.string()
        .min(1, 'End date is required')
        .regex(/^\d{4}-\d{2}$/, 'End date must be in YYYY-MM format'),
    gpa: z.string()
        .max(10, 'GPA must be less than 10 characters')
        .optional(),
});

// Skill Schema
export const SkillSchema = z.object({
    id: z.string(),
    name: z.string()
        .min(1, 'Skill name is required')
        .max(50, 'Skill name must be less than 50 characters'),
    category: z.enum(['technical', 'soft', 'language', 'tool'], {
        message: 'Please select a valid category'
    }),
});

// Customization Schema
export const CustomizationSchema = z.object({
    template: z.string(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
    font: z.string(),
    sectionOrder: z.array(z.string()),
}).optional();

// Full Resume Data Schema
export const ResumeDataSchema = z.object({
    id: z.string().optional(),
    personalInfo: PersonalInfoSchema.optional(),
    experience: z.array(WorkExperienceSchema).optional(),
    education: z.array(EducationSchema).optional(),
    skills: z.array(SkillSchema).optional(),
    customization: CustomizationSchema,
});

// Type exports (inferred from schemas)
export type PersonalInfoInput = z.infer<typeof PersonalInfoSchema>;
export type WorkExperienceInput = z.infer<typeof WorkExperienceSchema>;
export type EducationInput = z.infer<typeof EducationSchema>;
export type SkillInput = z.infer<typeof SkillSchema>;
export type CustomizationInput = z.infer<typeof CustomizationSchema>;
export type ResumeDataInput = z.infer<typeof ResumeDataSchema>;

/**
 * Validation helper functions
 */

// Validate a single field
export function validateField<T>(
    schema: z.ZodSchema<T>,
    value: unknown
): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(value);
    if (result.success) {
        return { success: true, data: result.data };
    } else {
        return { success: false, error: result.error.issues[0]?.message || 'Validation failed' };
    }
}

// Validate partial data (for step validation)
export function validatePartial<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    value: unknown
): { success: true; data: any } | { success: false; errors: Record<string, string> } {
    const result = schema.partial().safeParse(value);
    if (result.success) {
        return { success: true, data: result.data };
    } else {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            errors[path] = issue.message;
        });
        return { success: false, errors };
    }
}

// Get all errors from validation
export function getAllErrors<T>(
    schema: z.ZodSchema<T>,
    value: unknown
): Record<string, string> {
    const result = schema.safeParse(value);
    if (result.success) {
        return {};
    } else {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            errors[path] = issue.message;
        });
        return errors;
    }
}

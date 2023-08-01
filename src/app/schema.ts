import z from "zod";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const input = z
  .object({
    destination: z.string().min(1, { message: "Please fill in a destination" }),
    description: z.string().min(1, { message: "Please fill in a description" }),
    startDate: z.string().min(1, { message: "Please fill in a startDate" }),
    endDate: z.string().min(1, { message: "Please fill in a endDate" }),
  })
  .refine(({ endDate, startDate }) => new Date(endDate) > new Date(startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    ({ endDate, startDate }) =>
      new Date(endDate).getTime() - new Date(startDate).getTime() <=
      DAY_IN_MS * 4,
    {
      message: "Range selected can not be longer than 5 days",
      path: ["endDate"],
    }
  );

export const output = z.object({
  title: z.string().min(1),
  days: z.array(
    z.object({
      date: z.string().min(1),
      activities: z.array(
        z.object({
          time: z.string().min(1),
          description: z.string().min(1),
          title: z.string().min(1),
        })
      ),
    })
  ),
});

export const itinerary = z.object({
  id: z.string().min(1),
  input,
  output,
  activated: z.boolean().default(false),
});

export type Input = z.infer<typeof input>;
export type Output = z.infer<typeof output>;
export type Itinerary = z.infer<typeof itinerary>;

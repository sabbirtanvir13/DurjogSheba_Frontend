import z from "zod";

export const createShelterZodSchema = z.object({
	name: z.string({ message: "Shelter name is required" }),
	district: z.string({ message: "District is required" }),
	upazila: z.string({ message: "Upazila is required" }),
	address: z.string({ message: "Address is required" }),
	capacity: z.coerce
		.number({ message: "Capacity is required" })
		.min(1, "Capacity must be at least 1"),
	currentPeople: z.coerce.number().optional().default(0),
	contactPerson: z.string({ message: "Contact person name is required" }),
	contactPhone: z.string({ message: "Contact phone is required" }),
	coordinatorId: z.string().optional(),
	images: z.array(z.string()).optional(),
});

export const updateShelterZodSchema = z.object({
	name: z.string().optional(),
	district: z.string().optional(),
	upazila: z.string().optional(),
	address: z.string().optional(),
	capacity: z.coerce.number().optional(),
	currentPeople: z.coerce.number().optional(),
	contactPerson: z.string().optional(),
	contactPhone: z.string().optional(),
	coordinatorId: z.string().optional(),
	images: z.array(z.string()).optional(),
});
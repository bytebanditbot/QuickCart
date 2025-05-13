import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'quickcart-sync-user-created',
    },
    {
        event: 'clerk/user.created'
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)



// Updade
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'quickcart-sync-user-updated', // UNIQUE ID
    },
    {
        event: 'clerk/user.updated'
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)



// Delete
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'quickcart-sync-user-deleted', // Unique id
    },
    {
        event: 'clerk/user.deleted'
    },
    async ({ event }) => {
        const {id} = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)
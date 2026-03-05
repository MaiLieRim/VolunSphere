// Mock Task API
export function useTaskApi() {
    
    const createTask = async (taskData) => {
        try {
            // Create task object with proper schema structure
            const newTask = {
                "@context": "https://schema.org/",
                "@type": "JobPosting",
                "title": taskData.title,
                "description": taskData.description,
                "occupationalCategory": taskData.category,
                "validThrough": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                "datePosted": new Date().toISOString().split('T')[0],
                "industry": taskData.category,
                "identifier": {
                    "@type": "PropertyValue",
                    "value": `TASK-${Date.now()}`,
                    "name": "New Task ID"
                },
                "hiringOrganization": {
                    "@type": "Organization",
                    "name": "Soccer Club Linz United",
                    "logo": "/assets/images/imgPlaceholder.png"
                },
                "jobLocation": {
                    "@type": "Place",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": taskData.address,
                        "addressLocality": taskData.city,
                        "postalCode": taskData.postalCode,
                        "addressCountry": "Österreich"
                    }
                },
                "applicationContact": {
                    "@type": "ContactPoint",
                    "email": "contact@soccerclub.at",
                    "telephone": "+43-1-123456"
                },
                "baseSalary": {
                    "@type": "PriceSpecification",
                    "currency": "EUR",
                    "price": "0"
                },
                "totalJobOpenings": 1,
                "skills": taskData.skills,
                "requirements": taskData.requirements,
                "startDate": taskData.startDate,
                "startTime": taskData.startTime,
                "isFullDay": taskData.recurring
            };

            // Store in localStorage (mock storage)
            const existingTasks = JSON.parse(localStorage.getItem('customTasks')) || [];
            existingTasks.push(newTask);
            localStorage.setItem('customTasks', JSON.stringify(existingTasks));

            // Log success (replace with real API call)
            console.log("Task created successfully:", newTask);
            
            // Return success response
            return {
                success: true,
                message: "Aufgabe erfolgreich erstellt",
                task: newTask
            };

        } catch (error) {
            console.error("Error creating task:", error);
            return {
                success: false,
                message: "Fehler beim Erstellen der Aufgabe",
                error: error.message
            };
        }
    };

    const getTasks = () => {
        try {
            const customTasks = JSON.parse(localStorage.getItem('customTasks')) || [];
            return customTasks;
        } catch (error) {
            console.error("Error retrieving tasks:", error);
            return [];
        }
    };

    return {
        createTask,
        getTasks
    };
}

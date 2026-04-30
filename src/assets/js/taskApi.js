// Mock Task API
export function useTaskApi() {
    const buildTaskPayload = (taskData, existingTask = null) => {
        const idValue = existingTask?.identifier?.value || taskData.id || taskData.identifier?.value || `TASK-${Date.now()}`;
        return {
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": taskData.title,
            "description": taskData.description,
            "occupationalCategory": taskData.category,
            "validThrough": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "datePosted": existingTask?.datePosted || new Date().toISOString().split('T')[0],
            "jobStartDate": taskData.startDate,
            "industry": taskData.category,
            "identifier": {
                "@type": "PropertyValue",
                "value": idValue,
                "name": "Task ID"
            },
            "hiringOrganization": {
                "@type": "Organization",
                "name": taskData.club || existingTask?.hiringOrganization?.name || "Organisation",
                "logo": existingTask?.hiringOrganization?.logo || "/imgPlaceholder.png"
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
            "applicationContact": existingTask?.applicationContact || {
                "@type": "ContactPoint",
                "email": "contact@organisation.at",
                "telephone": "+43-1-123456"
            },
            "baseSalary": existingTask?.baseSalary || {
                "@type": "PriceSpecification",
                "currency": "EUR",
                "price": "0"
            },
            "totalJobOpenings": existingTask?.totalJobOpenings || 1,
            "skills": taskData.skills,
            "requirements": taskData.requirements,
            "startTime": taskData.startTime,
            "isFullDay": taskData.recurring
        };
    };

    const getCustomTasks = () => {
        try {
            const customTasks = JSON.parse(localStorage.getItem('customTasks')) || [];
            return customTasks;
        } catch (error) {
            console.error("Error retrieving tasks:", error);
            return [];
        }
    };

    const getDeletedTaskIds = () => {
        try {
            return JSON.parse(localStorage.getItem('deletedTaskIds')) || [];
        } catch (error) {
            console.error("Error retrieving deleted task ids:", error);
            return [];
        }
    };

    const createTask = async (taskData) => {
        try {
            const newTask = buildTaskPayload(taskData);
            const existingTasks = getCustomTasks();
            existingTasks.push(newTask);
            localStorage.setItem('customTasks', JSON.stringify(existingTasks));
            console.log("Task created successfully:", newTask);
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

    const updateTask = async (taskData) => {
        try {
            const existingTasks = getCustomTasks();
            const taskId = taskData.id || taskData.identifier?.value;
            const index = existingTasks.findIndex(task => task.identifier?.value === taskId);
            if (index !== -1) {
                existingTasks[index] = buildTaskPayload(taskData, existingTasks[index]);
                localStorage.setItem('customTasks', JSON.stringify(existingTasks));
                return {
                    success: true,
                    message: "Aufgabe erfolgreich aktualisiert",
                    task: existingTasks[index]
                };
            }
            const overrideTask = buildTaskPayload(taskData);
            existingTasks.push(overrideTask);
            localStorage.setItem('customTasks', JSON.stringify(existingTasks));
            return {
                success: true,
                message: "Aufgabe erfolgreich aktualisiert",
                task: overrideTask
            };
        } catch (error) {
            console.error("Error updating task:", error);
            return {
                success: false,
                message: "Fehler beim Aktualisieren der Aufgabe",
                error: error.message
            };
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const existingTasks = getCustomTasks();
            const taskIndex = existingTasks.findIndex(task => task.identifier?.value === taskId);
            if (taskIndex !== -1) {
                existingTasks.splice(taskIndex, 1);
                localStorage.setItem('customTasks', JSON.stringify(existingTasks));
                return {
                    success: true,
                    message: "Aufgabe gelöscht"
                };
            }
            const deletedTaskIds = getDeletedTaskIds();
            if (!deletedTaskIds.includes(taskId)) {
                deletedTaskIds.push(taskId);
                localStorage.setItem('deletedTaskIds', JSON.stringify(deletedTaskIds));
            }
            return {
                success: true,
                message: "Aufgabe lokal ausgeblendet"
            };
        } catch (error) {
            console.error("Error deleting task:", error);
            return {
                success: false,
                message: "Fehler beim Löschen der Aufgabe",
                error: error.message
            };
        }
    };

    return {
        createTask,
        getTasks: getCustomTasks,
        getDeletedTaskIds,
        updateTask,
        deleteTask
    };
}

import { computed, ref } from 'vue';
import { useTaskApi } from '@/assets/js/taskApi';
import tasks from '@/assets/data/tasks.json';

const tasksArray = Array.isArray(tasks) ? tasks : tasks.itemListElement || [];

export function useTasks() {
    const { getTasks } = useTaskApi();
    const customTasks = ref(getTasks());

    const refreshTasks = () => {
        customTasks.value = getTasks();
    };

    // Generic mapper for task objects
    const mapTask = (job) => ({
        title: job.title,
        description: job.description,
        occupationalCategory: job.occupationalCategory,
        industry: job.industry,
        location: job.jobLocation?.address?.addressLocality || '',
        club: job.hiringOrganization?.name || '',
        day: job.datePosted ? new Date(job.datePosted).getDate() : null,
        month: job.datePosted ? new Date(job.datePosted).toLocaleString('default', { month: 'long' }) : '',
        jobs: job.totalJobOpenings || 0,
        image: job.image || 'imgPlaceholder.png',
        logo: job.hiringOrganization?.logo || 'imgPlaceholder.png',
        id: job.identifier?.value || '',
        datePosted: job.datePosted || '',
        validThrough: job.validThrough || '',
        address: job.jobLocation?.address || {},
        hiringOrganization: job.hiringOrganization || {},
        applicationContact: job.applicationContact || {},
        baseSalary: job.baseSalary || null,
        skills: job.skills || [],
        requirements: job.requirements || [],
        jobStartDate: job.jobStartDate || '',
        startTime: job.startTime || '',
        workHours: job.workHours || '',
        employmentType: job.employmentType || '',
        responsibilities: job.responsibilities || [],
        qualifications: job.qualifications || [],
        isFullDay: job.isFullDay || false
    });

    // Combine all tasks into a single array
    const allTasks = computed(() => {
        const staticTasks = tasksArray.map(mapTask);
        const customTasksMapped = customTasks.value.map(mapTask);
        return [...staticTasks, ...customTasksMapped];
    });

    // Get task by ID
    const getTaskById = (id) => {
        return allTasks.value.find(task => task.id === id);
    };

    // Get all tasks for a specific organization
    const getTasksByOrganization = (orgName) => {
        return allTasks.value.filter(task => task.club === orgName);
    };

    // Get all tasks grouped by organization
    const getAllTasksByOrganizations = () => {
        return allTasks.value.reduce((acc, task) => {
            if (!acc[task.club]) acc[task.club] = [];
            acc[task.club].push(task);
            return acc;
        }, {});
    };

    return {
        allTasks,
        refreshTasks,
        getTaskById,
        getTasksByOrganization,
        getAllTasksByOrganizations
    };
}
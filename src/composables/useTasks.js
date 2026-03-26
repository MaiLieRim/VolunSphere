import { computed } from 'vue';
import { useTaskApi } from '@/assets/js/taskApi';
import tasklist from '@/assets/data/tasklist.json';
import firedeptasks from '@/assets/data/firedeptasks.json';
import Logo from '@/components/Logo.vue';

export function useTasks() {
    const { getTasks } = useTaskApi();

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
        image: job.image || '/placeholder.png',
        logo: job.hiringOrganization?.logo || '/placeholder.png',
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
        const staticTasks = tasklist.itemListElement.map(mapTask);
        const fireDeptTasks = firedeptasks.itemListElement.map(mapTask);
        const customTasks = getTasks().map(mapTask);

        return [...staticTasks, ...fireDeptTasks, ...customTasks];
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
        getTaskById,
        getTasksByOrganization,
        getAllTasksByOrganizations
    };
}
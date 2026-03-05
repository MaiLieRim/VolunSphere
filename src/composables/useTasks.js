import { computed } from 'vue';
import { useTaskApi } from '@/assets/js/taskApi';
import tasklist from '@/assets/data/tasklist.json';
import firedeptasks from '@/assets/data/firedeptasks.json';

export function useTasks() {
    const { getTasks } = useTaskApi();

    const allTasks = computed(() => {
        // Static tasks from tasklist.json
        const staticTasks = tasklist.itemListElement.map(job => ({
            title: job.title,
            description: job.description,
            occupationalCategory: job.occupationalCategory,
            industry: job.industry,
            location: job.jobLocation.address.addressLocality,
            club: job.hiringOrganization.name,
            day: new Date(job.datePosted).getDate(),
            month: new Date(job.datePosted).toLocaleString('default', { month: 'long' }),
            jobs: job.totalJobOpenings,
            image: job.hiringOrganization.logo,
            id: job.identifier.value,
            datePosted: job.datePosted,
            validThrough: job.validThrough,
            address: job.jobLocation.address,
            hiringOrganization: job.hiringOrganization,
            applicationContact: job.applicationContact,
            baseSalary: job.baseSalary,
            skills: job.skills,
            requirements: job.requirements,
            startDate: job.startDate,
            startTime: job.startTime,
            workHours: job.workHours,
            employmentType: job.employmentType,
            responsibilities: job.responsibilities,
            qualifications: job.qualifications,
            isFullDay: job.isFullDay
        }));

        // Static tasks from firedeptasks.json
        const fireDeptTasks = firedeptasks.itemListElement.map(job => ({
            title: job.title,
            description: job.description,
            occupationalCategory: job.occupationalCategory,
            industry: job.industry,
            location: job.jobLocation.address.addressLocality,
            club: job.hiringOrganization.name,
            day: new Date(job.datePosted).getDate(),
            month: new Date(job.datePosted).toLocaleString('default', { month: 'long' }),
            jobs: job.totalJobOpenings,
            image: job.hiringOrganization.logo,
            id: job.identifier.value,
            datePosted: job.datePosted,
            validThrough: job.validThrough,
            address: job.jobLocation.address,
            hiringOrganization: job.hiringOrganization,
            applicationContact: job.applicationContact,
            baseSalary: job.baseSalary,
            skills: job.skills,
            requirements: job.requirements,
            startDate: job.startDate,
            startTime: job.startTime,
            workHours: job.workHours,
            employmentType: job.employmentType,
            responsibilities: job.responsibilities,
            qualifications: job.qualifications,
            isFullDay: job.isFullDay
        }));

        // Custom tasks from localStorage
        const customTasks = getTasks().map(job => ({
            title: job.title,
            description: job.description,
            occupationalCategory: job.occupationalCategory,
            industry: job.industry,
            location: job.jobLocation.address.addressLocality,
            club: job.hiringOrganization.name,
            day: new Date(job.datePosted).getDate(),
            month: new Date(job.datePosted).toLocaleString('default', { month: 'long' }),
            jobs: job.totalJobOpenings,
            image: job.hiringOrganization.logo,
            id: job.identifier.value,
            datePosted: job.datePosted,
            validThrough: job.validThrough,
            address: job.jobLocation.address,
            hiringOrganization: job.hiringOrganization,
            applicationContact: job.applicationContact,
            baseSalary: job.baseSalary,
            skills: job.skills,
            requirements: job.requirements,
            startDate: job.startDate,
            startTime: job.startTime,
            workHours: job.workHours,
            employmentType: job.employmentType,
            responsibilities: job.responsibilities,
            qualifications: job.qualifications,
            isFullDay: job.isFullDay
        }));

        return [...staticTasks, ...fireDeptTasks, ...customTasks];
    });

    const getTaskById = (id) => {
        return allTasks.value.find(task => task.id === id);
    };

    return {
        allTasks,
        getTaskById
    };
}
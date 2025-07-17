import {tool} from 'ai';
import z from 'zod';
export const userGradesData = [
    {
      id: "USR001",
      name: "John Smith",
      age: 16,
      grade: "10th",
      subjects: [
        { name: "Mathematics", score: 87, maxScore: 100 },
        { name: "Science", score: 92, maxScore: 100 },
        { name: "English", score: 78, maxScore: 100 },
        { name: "History", score: 85, maxScore: 100 },
        { name: "Computer Science", score: 95, maxScore: 100 }
      ],
      gpa: 3.7,
      attendance: 95,
      ranking: 3,
      teacherRemarks: "Excellent in STEM subjects, needs improvement in English"
    },
    {
      id: "USR002",
      name: "Emily Johnson",
      age: 15,
      grade: "9th",
      subjects: [
        { name: "Mathematics", score: 76, maxScore: 100 },
        { name: "Science", score: 82, maxScore: 100 },
        { name: "English", score: 94, maxScore: 100 },
        { name: "History", score: 91, maxScore: 100 },
        { name: "Art", score: 98, maxScore: 100 }
      ],
      gpa: 3.8,
      attendance: 98,
      ranking: 2,
      teacherRemarks: "Creative student with exceptional language skills"
    },
    {
      id: "USR003",
      name: "Michael Chen",
      age: 17,
      grade: "11th",
      subjects: [
        { name: "Mathematics", score: 95, maxScore: 100 },
        { name: "Physics", score: 91, maxScore: 100 },
        { name: "Chemistry", score: 89, maxScore: 100 },
        { name: "English", score: 84, maxScore: 100 },
        { name: "Computer Science", score: 97, maxScore: 100 }
      ],
      gpa: 3.9,
      attendance: 97,
      ranking: 1,
      teacherRemarks: "Outstanding academic performance across all subjects"
    },
    {
      id: "USR004",
      name: "Sophia Rodriguez",
      age: 16,
      grade: "10th",
      subjects: [
        { name: "Mathematics", score: 67, maxScore: 100 },
        { name: "Science", score: 72, maxScore: 100 },
        { name: "English", score: 78, maxScore: 100 },
        { name: "History", score: 81, maxScore: 100 },
        { name: "Music", score: 95, maxScore: 100 }
      ],
      gpa: 3.0,
      attendance: 88,
      teacherRemarks: "Shows exceptional talent in music, needs more focus on STEM subjects"
    },]

export const getGradeData = tool({
    description: 'Use this tool to get users grade',
    parameters: z.object({
        name: z.string().describe('Name of the user'),
    }),
    execute: async({name}) => {
        console.log(name)

        const result = userGradesData.filter((x) => x.name === name)
        
        if (result.length === 0) {
            return { error: 'No student found with that name' }
        }
        console.log(result)
        return result[0]
    }
    })
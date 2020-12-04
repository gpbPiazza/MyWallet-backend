/* eslint-disable no-unused-vars */
import User from '../../interfaces/usersInterfaces'
import Session from '../../interfaces/sessionInterfaces'
import express = require('express')

declare namespace Express {
    export interface Request {
       user: User,
       session: Session
    }
}

// declare global {
//     namespace Express {
//         interface Resquest {
//             user: User,
//             sessions: Session,
//         }
//       }
//     namespace NodeJS {
//       interface ProcessEnv {
//         DB_USER: string;
//         DB_HOST: string;
//         DB_PORT: number;
//         DB_DATABASE: string;
//         DB_PASSWORD: string;
//         PORT: number;
//       }
//     }
//   }
// export {}

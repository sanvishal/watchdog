import {firebaseRootPath, firebaseRefPaths} from '../config/dbConstants';

export const getDatabasePath = (refPath) => {
    return `/${firebaseRootPath}/` + refPath;
}
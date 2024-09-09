import fs from 'fs';

export const checkFilePermissions = (filePath) => {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error('Error getting file stats:', err);
        } else {
            console.log('File permissions:', stats.mode.toString(8));
        }
    });
};
const catchAsync = require('../utils/catchAsync');
const { spawn } = require('child_process');
const path = require('path');


module.exports.searchEngine = catchAsync(async (req, res, next) => {
    const childPython = spawn('python3', [path.normalize(`${__dirname}/../project_source.py`)]);
    childPython.stdin.write(JSON.stringify(req.body));
    
    const bestMatch = await new Promise((resolve, reject) => {
        childPython.stdout.on('data', (data) => {
            resolve(parsedData);
        });
        
        childPython.stderr.on('data', (err) => {
            reject(new Error(err.toString()));
        });

        childPython.stderr.on('end', () => {
            reject(new Error('An error occurred while executing the Python script.'));
        });
    });

    res.status(200).json({
        status: 'success',
        data: { bestMatch }
    });
});

  
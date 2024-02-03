# Job Application API 
This API, runs on localhost, and was created to simulate applicants apply for a job and recruiters creating job postings. Recruiters are able to create a User account and create and delete job postings. Applicants are able to create applicant accounts to apply for job postings. 

## Installation 
1. Assuming you are cloneing the repository with the SSH,copy the URL: `git@github.com:mchen719/application-api`.git
2. Open your terminal and change the current working directory to the location where you want ot clone the directory 
3. Clone the repo in the local directory: `git clone git@github.com:mchen719/application-api.git`
4. cd into the cloned directory 
5. Open the code in vs code using code .
6. In the terminal, install all the necessary packages: `npm i express mongoose dotenv bcrypt jsonwebtoken` and install the dev scripts: `npm i -D mongodb-memory-server jest supertest`. 
7. Create a .env file and input your MONGO_URI and SECRET

## Running the Tests 
1. Check to make sure jest and supertest is installed, if not, reference step 6 in the installation guide.
2. In the package.json, edit the "scripts" to add "jest" as well as set jest's testing environment to "node".(Reference below)
```
"scripts": {
    "test": "jest",
    "start": "node server.js",
    "dev": "nodemon",
    "load": "artillery run artillery.yml"
  },
  "jest": {
    "testEnvironment": "node"
  },
```
3. Run the tests by typing `npm run test` in the terminal.

## Tests
There are 3 test files one for each of the 3 models and respective controllers and routers.  

### 1. Applicant Test (applicant.test.js)
This file tests 6 routes for the applicants. 

1. **applicantCtrl.createApplicant (/applicants):** A post request that allows an applicant to create a new account.

2. **applicantCtrl.show (/applicant/:id):** A get request that shows thed details for a job with the matching id. 

3. **applicantCtrl.updateApplicant (/applicant/:id):** A put request that allows an applicant to update their profile. 

4. **applicantCtrl.deleteApplicant (/applicant/:id):** A delete request that allows the user to delete their account 

5. **applicantCtrl.apply (/:applicantId/apply/:jobId):** A post request that allows the applicant to apply for an existing job. This will populate the "applicants" array in the job with the applicant's information and the "appliedJobs" array for the applicant with the job they applied to. 

6. **applicantCtrl.index (/:applicantId/appliedJobs):** A get request that allows the applicant to see the jobs they applied for. 

### 2. Job Tests (job.test.js)
This file tests 3 routes for jobs 

1. **jobCtrl.create (/jobs/recruiter/:recruiterId'):** A post request that allows a recruiter to create a new job. This will also link a created job to a recruiter. 

2. **jobCrtrl.index (/jobs):** A get request that allows you to see all posted jobs. 

3. **jobCtrl.show (/jobs/:id):** A get request that allows the user to see the details of one job. 

### 3. Recruiter Tests (recruiter.test.js)
This file tests 3 routes for recruiters

1. **recruiterCtrl.createRecruiter (/recruiters):** A post request that allows a user to create a recruiter account. 

2. **recruiterCtrl.updateRecruiter (/recruiters/:id)"** A put request that allows a recruiter to update their account 

3. **recruiterCtrl.deleteRecruiter (/recruiters/:id):** A delete request that allows the recruiter to delete their account. 
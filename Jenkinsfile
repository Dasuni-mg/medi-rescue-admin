pipeline {
    agent {
        label 'mw-cicd-build'
    }
    parameters {
        string(      defaultValue: 'latest',         description: 'Admin Frontend release version',                     name: 'VERSION')
        string(      defaultValue: 'release/latest', description: 'Git branch',                                         name: 'BRANCH')
        string(      defaultValue: '',               description: 'Artifactory user name',                              name: 'ARTIFACTORY_USER_NAME')
        password(    defaultValue: '',               description: 'Artifactory password',                               name: 'ARTIFACTORY_PASSWORD')
        booleanParam(defaultValue: false,            description: 'Install Dependecies',                                name: 'INSTALL_DEPENDECIES')
        booleanParam(defaultValue: false,            description: 'Run unit tests',                                     name: 'RUN_UNIT_TESTS')
        booleanParam(defaultValue: false,            description: 'SonarQube analysis',                                 name: 'SONARQUBE_ANALYSIS')
        booleanParam(defaultValue: false,            description: 'Build Docker image',                                 name: 'BUILD_DOCKER_IMAGE')
        booleanParam(defaultValue: false,            description: 'Push docker image to GCP',                           name: 'PUSH_DOCKER_IMAGE')
        booleanParam(defaultValue: false,            description: 'Push normal build to Artifactory',                   name: 'PUSH_BUILD_ARTIFACTORY')
        booleanParam(defaultValue: false,            description: 'System clean',                                       name: 'SYSTEM_CLEAN')
        booleanParam(defaultValue: false,            description: 'Run CD job',                                         name: 'RUN_CD_JOB')
        string(      defaultValue: 'CI_DHS/CD_DHS',  description: 'CD job path',                                        name: 'CD_JOB_PATH')
        string(      defaultValue: 'release/latest', description: 'Admin Frontend deployment Git branch',               name: 'DEPLOYMENT_GIT_BRANCH')
        string(      defaultValue: '',               description: 'Admin Frontend deployment server IP Ex: 10.0.0.127', name: 'DEPLOYMENT_SERVER_IP')
        string(      defaultValue: 'jenkins_user',   description: 'Admin Frontend deployment server name',              name: 'DEPLOYMENT_SERVER_NAME')
        booleanParam(defaultValue: true,             description: 'Admin Frontend',                                     name: 'APP')
    }

    environment {
        VERSION                = "${VERSION}"
        BRANCH                 = "${BRANCH}"
        ARTIFACTORY_USER_NAME  = "${ARTIFACTORY_USER_NAME}"
        ARTIFACTORY_PASSWORD   = "${ARTIFACTORY_PASSWORD}"
        INSTALL_DEPENDECIES    = "${INSTALL_DEPENDECIES}"
        RUN_UNIT_TESTS         = "${RUN_UNIT_TESTS}"
        SONARQUBE_ANALYSIS     = "${SONARQUBE_ANALYSIS}"
        BUILD_DOCKER_IMAGE     = "${BUILD_DOCKER_IMAGE}"
        PUSH_DOCKER_IMAGE      = "${PUSH_DOCKER_IMAGE}"
        PUSH_BUILD_ARTIFACTORY = "${PUSH_BUILD_ARTIFACTORY}"
        SYSTEM_CLEAN           = "${SYSTEM_CLEAN}"
        RUN_CD_JOB             = "${RUN_CD_JOB}"
        CD_JOB_PATH            = "${CD_JOB_PATH}"
        DEPLOYMENT_GIT_BRANCH  = "${DEPLOYMENT_GIT_BRANCH}"
        DEPLOYMENT_SERVER_IP   = "${DEPLOYMENT_SERVER_IP}"
        DEPLOYMENT_SERVER_NAME = "${DEPLOYMENT_SERVER_NAME}"
        APP                    = "${APP}"
    }

    stages {
        stage('Clone repository') {
            steps {
                dir('dhs-mr-smt-admin-frontend') {
                    git branch: "${BRANCH}",
                    credentialsId: 'a377ef50-7702-41f3-b677-d3059c419220',
                    url: "https://harshaliyanage@bitbucket.org/global-wavenet/dhs-mr-smt-admin-frontend.git"
                }
            }
        }
        stage ('Install dependecies') {
            when {
                expression { env.INSTALL_DEPENDECIES == 'true' }
            }
            steps {
                dir('dhs-mr-smt-admin-frontend') {
                    sh 'rm -rf node_modules'
                    sh 'rm -rf package-lock.json'
                    sh 'npm cache clean --force'
                    sh 'npm install'
                }
            }
        }
        stage('Run unit tests') {
            when {
                expression { env.RUN_UNIT_TESTS == 'true' } 
            }
            steps {
                dir('dhs-mr-smt-admin-frontend') {
                    sh 'node --max_old_space_size=8048'
                    sh 'npm run test'
                }
            }
        }
        stage ('SonarQube analysis') {
            when {
                expression { env.SONARQUBE_ANALYSIS == 'true' }
            }
            steps {
                dir('dhs-mr-smt-admin-frontend') {
                    script {
                        withCredentials([string(credentialsId: 'cred-integration-token-sonarqube', variable: 'SONARQUBE_TOKEN')]) {
                            sh '''
                                npm run sonar -- \
                                -Dsonar.host.url=https://sonarqube.mediwave.io \
                                -Dsonar.login=$SONARQUBE_TOKEN \
                            '''
                        }
                    }
                }
            }
        }
        stage('Build Docker image') {
            when {
                expression { env.BUILD_DOCKER_IMAGE == 'true' }
            }
            steps {
                dir('dhs-mr-smt-admin-frontend') {
                    script {
                        sh "docker build --no-cache -t gcr.io/digital-health-354005/dhs-mr-smt-admin-frontend:${VERSION} ."
                    }
                }
            }
        }
        stage('Push docker image to GCP') {
            when {
                expression { env.PUSH_DOCKER_IMAGE == 'true' }
            }
            steps {
                script {
                    sh "docker push gcr.io/digital-health-354005/dhs-mr-smt-admin-frontend:${VERSION}"
                }
            }
        }
        stage('Push normal build to artifactory') {
            when {
                expression { env.PUSH_BUILD_ARTIFACTORY == 'true' }
            }
            steps {
                dir('dhs-mr-smt-admin-frontend') {
                    script {
                        sh "npm run build"
                        sh "mkdir -p /tmp/dhs_releases/dhs-mr-smt-admin-frontend-${VERSION}"
                        sh "cp -R .next/ /tmp/dhs_releases/dhs-mr-smt-admin-frontend-${VERSION}"
                        
                        sh "cd /tmp/dhs_releases/dhs-mr-smt-admin-frontend-${VERSION} && tar -czvf dhs-mr-smt-admin-frontend-${VERSION}.tar.gz .next/"          
                        sh 'curl -v -u '+ARTIFACTORY_USER_NAME+':'+ARTIFACTORY_PASSWORD+' -F "raw.directory=/dhs-mr-smt-admin-frontend/" -F "raw.asset1=@/tmp/dhs_releases/dhs-mr-smt-admin-frontend-'+VERSION+'/dhs-mr-smt-admin-frontend-'+VERSION+'.tar.gz" -F "raw.asset1.filename=dhs-mr-smt-admin-frontend-'+VERSION+'.tar.gz" "https://artifactory.globalwavenet.com/service/rest/v1/components?repository=DHS"'
                        sh "rm -rf /tmp/dhs_releases/dhs-mr-smt-admin-frontend-${VERSION}"
                    }
                }
            }
        }
        stage('System clean') {
            when {
                expression { env.SYSTEM_CLEAN == 'true' }
            }
            steps {
                dir('dhs-mr-smt-admin-frontend') {
                    script {
                        sh 'docker image prune --all'
                        sh 'docker system prune --force'
                        sh 'docker builder prune --force'
                        sh 'docker volume prune'
                    }
                }
            }
        }
        stage ('Starting CD job') {
            when {
                expression { env.RUN_CD_JOB == 'true' }
            }
            steps {
                script {
                    build job: "${CD_JOB_PATH}",
                    parameters: [
                        string(      name: 'DEPLOYMENT_GIT_BRANCH',  value: "${DEPLOYMENT_GIT_BRANCH}"),
                        string(      name: 'DEPLOYMENT_SERVER_IP',   value: "${DEPLOYMENT_SERVER_IP}"),
                        string(      name: 'DEPLOYMENT_SERVER_NAME', value: "${DEPLOYMENT_SERVER_NAME}"),
                        booleanParam(name: 'MR_SMT_ADMIN_FRONTEND',  value: "${APP}")
                    ]
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        cleanup {
            deleteDir()
        }
    }
}
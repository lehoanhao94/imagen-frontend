def getEnvCode(def _git_branch){
    if (_git_branch == "develop") {
        env_code = "dev"
    }
    else if (_git_branch == "staging") {
        env_code = "stg"
    }
    else if (_git_branch == "main") {
        env_code = "prod"
    }
    return env_code
}
 
pipeline {
    agent {
        label 'Jenkins-Agent'
    }
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '30')
    }
    environment {
        SERVICE_NAME    = 'frontend-geminigen-service'
        currentVersion  = "v1.0"
        PAGES_PROJECT_NAME = "frontend-geminigen"
        SHORT_COMMIT = "${GIT_COMMIT[0..7]}"
    }
    parameters {
        string(name: 'SLEEP_TIME_IN_SECONDS', defaultValue: '10', description: 'The waiting time to Sonar server perform analysis')
        string(name: 'BUILD_MANUAL', defaultValue: 'Name-Service', description: 'Enter the Name Service')
    }

    
    stages {
        stage('Pre Deployment') {
            when{
                anyOf{
                    changeset "**"
                    expression { params.BUILD_MANUAL == 'frontend-geminigen' }
                }
                anyOf {
                    branch 'develop'
                    branch 'staging'
                    branch 'main'
                }
            }
            steps {
                slackSend (
                    channel: 'tts-cicd-notify',
                    color: '#FFFF00',
                    message: "Staring Job:          » ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nBranch     » ${env.GIT_BRANCH}\nCommit:   » ${env.GIT_COMMIT}\nURL:          » (${env.BUILD_URL})",
                    teamDomain: 'chatbotgpt-group',
                    tokenCredentialId: 'ttsopenai-slack'
                )
                script {
                    env.GIT_TAG = sh(returnStdout: true, script: 'git tag --points-at ${GIT_COMMIT} || :').trim()
                    env.GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
                }
            }
        }
        stage('Checkout Source Code') {
            when{
                anyOf{
                    changeset "**"
                    expression { params.BUILD_MANUAL == 'frontend-geminigen' }
                }
                anyOf {
                    branch 'develop'
                    branch 'staging'
                    branch 'main'
                }
            }
            steps {

                script {
                    env.ENV_CODE = getEnvCode(env.BRANCH_NAME)
                    echo "${ENV_CODE}"
                    checkout([
                        $class: 'GitSCM',
                        branches: scm.branches,
                        doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
                        extensions: scm.extensions + [[$class: 'CloneOption', noTags: false, reference: '', shallow: false]],
                        userRemoteConfigs: scm.userRemoteConfigs
                    ])
                    currentVersion = sh(returnStdout: true, script: "git tag -l | tail -1").trim()
                    echo "${currentVersion}"
                }
            }
        }

        stage('Update File Enviroment'){
            when {
                anyOf{
                    changeset "**"
                    expression { params.BUILD_MANUAL == 'frontend-geminigen' }
                }
                anyOf {
                    branch 'develop'
                    branch 'staging'
                    branch 'main'
                }
            }
            steps {
                configFileProvider([
                    configFile(fileId: "${PAGES_PROJECT_NAME}-${ENV_CODE}-profile", 
                    targetLocation: './.env')
                ]) { 
                    sh 'cat ./.env'
                }
                configFileProvider([
                    configFile(fileId: "cloudflare-pages-${PAGES_PROJECT_NAME}-${ENV_CODE}-profile", 
                    targetLocation: './.cloudflare-pages.credentials')
                ]) {
                    sh 'cat ./.cloudflare-pages.credentials'
                }
                echo "Update Frontend TTS Clone Service Profiles Done!!!!"
            }
        }
        stage('Build and Deploy'){
            when {
                anyOf{
                    changeset "**"
                    expression { params.BUILD_MANUAL == 'frontend-geminigen' }
                }
                anyOf {
                    branch 'develop'
                    branch 'staging'
                    branch 'main'
                }
            }
            steps {
                script {
                    env.ENV_CODE = getEnvCode(env.BRANCH_NAME)
                    def now = new Date()
                    def dateTag = now.format("yyyy_MM_dd_HHmmss")
                    env.IMAGE_TAG = "${SHORT_COMMIT}_${env.BRANCH_NAME}_${dateTag}"
                    load './.cloudflare-pages.credentials'
                    sh "docker buildx build -t local/${PAGES_PROJECT_NAME}-${ENV_CODE}-service:${IMAGE_TAG} -f Dockerfile ."
	                sh "docker run --rm -e CLOUDFLARE_ACCOUNT_ID=${env.CLOUDFLARE_ACCOUNT_ID} -e CLOUDFLARE_API_TOKEN=${env.CLOUDFLARE_API_TOKEN} local/${PAGES_PROJECT_NAME}-${ENV_CODE}-service:${IMAGE_TAG} wrangler pages deploy public --project-name=${PAGES_PROJECT_NAME}-${ENV_CODE}"
                    sh "docker rmi local/${PAGES_PROJECT_NAME}-${ENV_CODE}-service:${IMAGE_TAG}"
                }
                echo "Image tag: ${env.IMAGE_TAG}"
            }
        }
    }
  post {
    success {
        slackSend (
            channel: 'tts-cicd-notify',
            color: '#00FF00',
            message: "Status      » SUCCESS\nJob:          » ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nBranch     » ${env.GIT_BRANCH}\nCommit:   » ${env.GIT_COMMIT}\nURL:          » (${env.BUILD_URL})",
            teamDomain: 'chatbotgpt-group',
            tokenCredentialId: 'ttsopenai-slack'
        )
    }
    failure {
        slackSend (
            channel: 'tts-cicd-notify',
            color: '#FF0000',
            message: "Status      » FAILURE\nJob:          » ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nBranch     » ${env.GIT_BRANCH}\nCommit:   » ${env.GIT_COMMIT}\nURL:          » (${env.BUILD_URL})",
            teamDomain: 'chatbotgpt-group',
            tokenCredentialId: 'ttsopenai-slack'
        )
    }
  }
}

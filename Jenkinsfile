node('linux') {
  checkout scm

  nodejs(nodeJSInstallationName: 'NodeJS 6.x') {
    stage('Install') {
      sh 'npm prune && npm install'
    }

    stage('Setup - CI') {
      sh 'npm run setup:ci'
    }

    stage ('Build - Demo Apps') {
      sh 'npm run build:demo-apps'
    }

    stage('Test') {
      sh 'npm test'
    }
  }

  milestone 1
}

try {
  if (env.BRANCH_NAME == "sumt-master" || env.BRANCH_NAME.startsWith('SS')) {
      build job: 'Foundation Controls(GitHub_develop)', wait: false
  }
} catch(e) {
  echo 'Unable to find the Foundation control branch for downstream building. Not failing the build for this...'
  emailext body: "Unable to find the Foundation control branch for ng-table repository in github. Please view the build information here: ${env.BUILD_URL}",
      from: 'Jenkins CI Server <jenkins-no-reply@sumtotalsystems.com>',
      subject: 'The foundation-controls project build has failed',
	  to: 'SumTotal-DevOps-Build@skillsoft.com'
	  
      throw err
}

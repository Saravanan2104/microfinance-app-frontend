pipeline {
  agent any

  stages {
    stage("pull"){
      steps {
          git branch: 'main', credentialsId: 'token', url: 'https://github.com/Saravanan2104/microfinance-app-frontend.git'
      }
    }
    stage("install"){
      steps {
        sh 'npm install'
      }
    }
    stage("build"){
      steps {
        sh 'npm run build'
      }
    }
    stage("remove old build"){
      steps {
        sh 'sudo rm -rf /usr/share/nginx/html/*'
      }
    }
    stage("copy new build"){
      steps {
        sh 'sudo cp -r dist/* /usr/share/nginx/html/'
      }
    }
    stage("reload nginx"){
      steps {
        sh 'sudo systemctl reload nginx'
      }
    }
  }
}

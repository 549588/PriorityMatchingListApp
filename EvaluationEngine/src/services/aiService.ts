

export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
}

export class AIService {
    async generateQuestions(criteria: { techStack: string; skillLevel: string }): Promise<Question[]> {
        // Hardcoded questions for each skill and level
        type QuestionLevel = {
            [key: string]: Question[];
            low: Question[];
            medium: Question[];
            high: Question[];
        };
        const db: Record<string, QuestionLevel> = {
            "docker": {
                low: [
                    { id: 1, text: 'What is Docker?', options: ['Containerization', 'Virtualization', 'Database', 'None'], correctAnswer: 'Containerization' },
                    { id: 2, text: 'What is a container?', options: ['Isolated process', 'VM', 'Database', 'None'], correctAnswer: 'Isolated process' },
                    { id: 3, text: 'What is an image?', options: ['Template', 'Container', 'Database', 'None'], correctAnswer: 'Template' },
                    { id: 4, text: 'What is Dockerfile?', options: ['Build file', 'Config file', 'Database', 'None'], correctAnswer: 'Build file' },
                    { id: 5, text: 'What is docker-compose?', options: ['Multi-container', 'Single container', 'Database', 'None'], correctAnswer: 'Multi-container' },
                    { id: 6, text: 'What is docker hub?', options: ['Image repo', 'Container', 'Database', 'None'], correctAnswer: 'Image repo' },
                    { id: 7, text: 'What is docker run?', options: ['Start container', 'Stop container', 'Database', 'None'], correctAnswer: 'Start container' },
                    { id: 8, text: 'What is docker ps?', options: ['List containers', 'List images', 'Database', 'None'], correctAnswer: 'List containers' },
                    { id: 9, text: 'What is docker build?', options: ['Build image', 'Run container', 'Database', 'None'], correctAnswer: 'Build image' },
                    { id: 10, text: 'What is docker stop?', options: ['Stop container', 'Start container', 'Database', 'None'], correctAnswer: 'Stop container' }
                ],
                medium: [
                    { id: 11, text: 'What is docker network?', options: ['Network for containers', 'Network for VMs', 'Database', 'None'], correctAnswer: 'Network for containers' },
                    { id: 12, text: 'What is docker volume?', options: ['Persistent storage', 'Temporary storage', 'Database', 'None'], correctAnswer: 'Persistent storage' },
                    { id: 13, text: 'What is docker exec?', options: ['Run command', 'Run container', 'Database', 'None'], correctAnswer: 'Run command' },
                    { id: 14, text: 'What is docker logs?', options: ['View logs', 'View containers', 'Database', 'None'], correctAnswer: 'View logs' },
                    { id: 15, text: 'What is docker rm?', options: ['Remove container', 'Remove image', 'Database', 'None'], correctAnswer: 'Remove container' },
                    { id: 16, text: 'What is docker rmi?', options: ['Remove image', 'Remove container', 'Database', 'None'], correctAnswer: 'Remove image' },
                    { id: 17, text: 'What is docker tag?', options: ['Tag image', 'Tag container', 'Database', 'None'], correctAnswer: 'Tag image' },
                    { id: 18, text: 'What is docker pull?', options: ['Download image', 'Upload image', 'Database', 'None'], correctAnswer: 'Download image' },
                    { id: 19, text: 'What is docker push?', options: ['Upload image', 'Download image', 'Database', 'None'], correctAnswer: 'Upload image' },
                    { id: 20, text: 'What is docker inspect?', options: ['Inspect object', 'Inspect container', 'Database', 'None'], correctAnswer: 'Inspect object' }
                ],
                high: [
                    { id: 21, text: 'What is docker swarm?', options: ['Orchestration', 'Container', 'Database', 'None'], correctAnswer: 'Orchestration' },
                    { id: 22, text: 'What is docker service?', options: ['Service in swarm', 'Service in container', 'Database', 'None'], correctAnswer: 'Service in swarm' },
                    { id: 23, text: 'What is docker stack?', options: ['Stack of services', 'Stack of containers', 'Database', 'None'], correctAnswer: 'Stack of services' },
                    { id: 24, text: 'What is docker secret?', options: ['Secret management', 'Database', 'None', 'All'], correctAnswer: 'Secret management' },
                    { id: 25, text: 'What is docker config?', options: ['Config management', 'Database', 'None', 'All'], correctAnswer: 'Config management' },
                    { id: 26, text: 'What is docker context?', options: ['Context mgmt', 'Database', 'None', 'All'], correctAnswer: 'Context mgmt' },
                    { id: 27, text: 'What is docker checkpoint?', options: ['Save state', 'Database', 'None', 'All'], correctAnswer: 'Save state' },
                    { id: 28, text: 'What is docker prune?', options: ['Cleanup', 'Database', 'None', 'All'], correctAnswer: 'Cleanup' },
                    { id: 29, text: 'What is docker events?', options: ['Event stream', 'Database', 'None', 'All'], correctAnswer: 'Event stream' },
                    { id: 30, text: 'What is docker system df?', options: ['Disk usage', 'Database', 'None', 'All'], correctAnswer: 'Disk usage' }
                ]
            },
            "git": {
                low: [
                    { id: 1, text: 'What is Git?', options: ['Version control', 'Database', 'IDE', 'None'], correctAnswer: 'Version control' },
                    { id: 2, text: 'What is a repository?', options: ['Project storage', 'Database', 'IDE', 'None'], correctAnswer: 'Project storage' },
                    { id: 3, text: 'What is commit?', options: ['Save changes', 'Delete changes', 'None', 'All'], correctAnswer: 'Save changes' },
                    { id: 4, text: 'What is branch?', options: ['Parallel dev', 'Main dev', 'None', 'All'], correctAnswer: 'Parallel dev' },
                    { id: 5, text: 'What is merge?', options: ['Combine branches', 'Split branches', 'None', 'All'], correctAnswer: 'Combine branches' },
                    { id: 6, text: 'What is clone?', options: ['Copy repo', 'Delete repo', 'None', 'All'], correctAnswer: 'Copy repo' },
                    { id: 7, text: 'What is pull?', options: ['Get changes', 'Send changes', 'None', 'All'], correctAnswer: 'Get changes' },
                    { id: 8, text: 'What is push?', options: ['Send changes', 'Get changes', 'None', 'All'], correctAnswer: 'Send changes' },
                    { id: 9, text: 'What is remote?', options: ['Remote repo', 'Local repo', 'None', 'All'], correctAnswer: 'Remote repo' },
                    { id: 10, text: 'What is status?', options: ['Current state', 'Old state', 'None', 'All'], correctAnswer: 'Current state' }
                ],
                medium: [
                    { id: 11, text: 'What is rebase?', options: ['Move base', 'Move head', 'None', 'All'], correctAnswer: 'Move base' },
                    { id: 12, text: 'What is stash?', options: ['Save work', 'Delete work', 'None', 'All'], correctAnswer: 'Save work' },
                    { id: 13, text: 'What is tag?', options: ['Mark commit', 'Mark branch', 'None', 'All'], correctAnswer: 'Mark commit' },
                    { id: 14, text: 'What is cherry-pick?', options: ['Select commit', 'Select branch', 'None', 'All'], correctAnswer: 'Select commit' },
                    { id: 15, text: 'What is revert?', options: ['Undo commit', 'Undo branch', 'None', 'All'], correctAnswer: 'Undo commit' },
                    { id: 16, text: 'What is log?', options: ['History', 'Future', 'None', 'All'], correctAnswer: 'History' },
                    { id: 17, text: 'What is diff?', options: ['Show changes', 'Hide changes', 'None', 'All'], correctAnswer: 'Show changes' },
                    { id: 18, text: 'What is blame?', options: ['Show author', 'Show committer', 'None', 'All'], correctAnswer: 'Show author' },
                    { id: 19, text: 'What is HEAD?', options: ['Current commit', 'Old commit', 'None', 'All'], correctAnswer: 'Current commit' },
                    { id: 20, text: 'What is .gitignore?', options: ['Ignore files', 'Track files', 'None', 'All'], correctAnswer: 'Ignore files' }
                ],
                high: [
                    { id: 21, text: 'What is submodule?', options: ['Repo in repo', 'Repo in branch', 'None', 'All'], correctAnswer: 'Repo in repo' },
                    { id: 22, text: 'What is bisect?', options: ['Find bug', 'Find feature', 'None', 'All'], correctAnswer: 'Find bug' },
                    { id: 23, text: 'What is reflog?', options: ['Reference log', 'Reference branch', 'None', 'All'], correctAnswer: 'Reference log' },
                    { id: 24, text: 'What is gc?', options: ['Garbage collection', 'Good commit', 'None', 'All'], correctAnswer: 'Garbage collection' },
                    { id: 25, text: 'What is fsck?', options: ['File system check', 'File system clean', 'None', 'All'], correctAnswer: 'File system check' },
                    { id: 26, text: 'What is filter-branch?', options: ['Rewrite history', 'Rewrite branch', 'None', 'All'], correctAnswer: 'Rewrite history' },
                    { id: 27, text: 'What is worktree?', options: ['Multiple working dirs', 'Single working dir', 'None', 'All'], correctAnswer: 'Multiple working dirs' },
                    { id: 28, text: 'What is fast-forward?', options: ['Move branch pointer', 'Move commit pointer', 'None', 'All'], correctAnswer: 'Move branch pointer' },
                    { id: 29, text: 'What is merge conflict?', options: ['Conflict in merge', 'Conflict in commit', 'None', 'All'], correctAnswer: 'Conflict in merge' },
                    { id: 30, text: 'What is git flow?', options: ['Branching model', 'Commit model', 'None', 'All'], correctAnswer: 'Branching model' }
                ]
            },
            "aws": {
                low: [
                    { id: 1, text: 'What is AWS?', options: ['Cloud platform', 'Database', 'IDE', 'OS'], correctAnswer: 'Cloud platform' },
                    { id: 2, text: 'Which company owns AWS?', options: ['Amazon', 'Microsoft', 'Google', 'IBM'], correctAnswer: 'Amazon' },
                    { id: 3, text: 'What is EC2?', options: ['Virtual server', 'Database', 'IDE', 'None'], correctAnswer: 'Virtual server' },
                    { id: 4, text: 'What is S3?', options: ['Storage', 'Database', 'IDE', 'None'], correctAnswer: 'Storage' },
                    { id: 5, text: 'What is Lambda?', options: ['Serverless', 'Database', 'IDE', 'None'], correctAnswer: 'Serverless' },
                    { id: 6, text: 'What is RDS?', options: ['Relational DB', 'Database', 'IDE', 'None'], correctAnswer: 'Relational DB' },
                    { id: 7, text: 'What is VPC?', options: ['Virtual Private Cloud', 'Database', 'IDE', 'None'], correctAnswer: 'Virtual Private Cloud' },
                    { id: 8, text: 'What is CloudFront?', options: ['CDN', 'Database', 'IDE', 'None'], correctAnswer: 'CDN' },
                    { id: 9, text: 'What is IAM?', options: ['Identity Access Mgmt', 'Database', 'IDE', 'None'], correctAnswer: 'Identity Access Mgmt' },
                    { id: 10, text: 'What is Route 53?', options: ['DNS', 'Database', 'IDE', 'None'], correctAnswer: 'DNS' }
                ],
                medium: [
                    { id: 11, text: 'What is CloudWatch?', options: ['Monitoring', 'Database', 'IDE', 'None'], correctAnswer: 'Monitoring' },
                    { id: 12, text: 'What is CloudTrail?', options: ['Logging', 'Database', 'IDE', 'None'], correctAnswer: 'Logging' },
                    { id: 13, text: 'What is SQS?', options: ['Queue', 'Database', 'IDE', 'None'], correctAnswer: 'Queue' },
                    { id: 14, text: 'What is SNS?', options: ['Notification', 'Database', 'IDE', 'None'], correctAnswer: 'Notification' },
                    { id: 15, text: 'What is EBS?', options: ['Block storage', 'Database', 'IDE', 'None'], correctAnswer: 'Block storage' },
                    { id: 16, text: 'What is EFS?', options: ['File storage', 'Database', 'IDE', 'None'], correctAnswer: 'File storage' },
                    { id: 17, text: 'What is CloudFormation?', options: ['IaC', 'Database', 'IDE', 'None'], correctAnswer: 'IaC' },
                    { id: 18, text: 'What is Elastic Beanstalk?', options: ['App deploy', 'Database', 'IDE', 'None'], correctAnswer: 'App deploy' },
                    { id: 19, text: 'What is Redshift?', options: ['Data warehouse', 'Database', 'IDE', 'None'], correctAnswer: 'Data warehouse' },
                    { id: 20, text: 'What is DynamoDB?', options: ['NoSQL DB', 'Database', 'IDE', 'None'], correctAnswer: 'NoSQL DB' }
                ],
                high: [
                    { id: 21, text: 'What is Elasticache?', options: ['Cache', 'Database', 'IDE', 'None'], correctAnswer: 'Cache' },
                    { id: 22, text: 'What is Kinesis?', options: ['Streaming', 'Database', 'IDE', 'None'], correctAnswer: 'Streaming' },
                    { id: 23, text: 'What is Glue?', options: ['ETL', 'Database', 'IDE', 'None'], correctAnswer: 'ETL' },
                    { id: 24, text: 'What is Athena?', options: ['Query service', 'Database', 'IDE', 'None'], correctAnswer: 'Query service' },
                    { id: 25, text: 'What is EMR?', options: ['Big data', 'Database', 'IDE', 'None'], correctAnswer: 'Big data' },
                    { id: 26, text: 'What is Sagemaker?', options: ['ML platform', 'Database', 'IDE', 'None'], correctAnswer: 'ML platform' },
                    { id: 27, text: 'What is Fargate?', options: ['Serverless containers', 'Database', 'IDE', 'None'], correctAnswer: 'Serverless containers' },
                    { id: 28, text: 'What is AppSync?', options: ['GraphQL API', 'Database', 'IDE', 'None'], correctAnswer: 'GraphQL API' },
                    { id: 29, text: 'What is CodePipeline?', options: ['CI/CD', 'Database', 'IDE', 'None'], correctAnswer: 'CI/CD' },
                    { id: 30, text: 'What is Cloud9?', options: ['IDE', 'Database', 'IDE', 'None'], correctAnswer: 'IDE' }
                ]
            },
            "kubernetes": {
                low: [
                    { id: 1, text: 'What is Kubernetes?', options: ['Container orchestration', 'Database', 'IDE', 'None'], correctAnswer: 'Container orchestration' },
                    { id: 2, text: 'What is a pod?', options: ['Smallest unit', 'Container', 'Database', 'None'], correctAnswer: 'Smallest unit' },
                    { id: 3, text: 'What is a node?', options: ['Worker machine', 'Database', 'IDE', 'None'], correctAnswer: 'Worker machine' },
                    { id: 4, text: 'What is a cluster?', options: ['Group of nodes', 'Database', 'IDE', 'None'], correctAnswer: 'Group of nodes' },
                    { id: 5, text: 'What is a deployment?', options: ['Manage pods', 'Database', 'IDE', 'None'], correctAnswer: 'Manage pods' },
                    { id: 6, text: 'What is a service?', options: ['Expose pods', 'Database', 'IDE', 'None'], correctAnswer: 'Expose pods' },
                    { id: 7, text: 'What is a namespace?', options: ['Virtual cluster', 'Database', 'IDE', 'None'], correctAnswer: 'Virtual cluster' },
                    { id: 8, text: 'What is kubelet?', options: ['Node agent', 'Database', 'IDE', 'None'], correctAnswer: 'Node agent' },
                    { id: 9, text: 'What is kubectl?', options: ['CLI tool', 'Database', 'IDE', 'None'], correctAnswer: 'CLI tool' },
                    { id: 10, text: 'What is etcd?', options: ['Key-value store', 'Database', 'IDE', 'None'], correctAnswer: 'Key-value store' }
                ],
                medium: [
                    { id: 11, text: 'What is ReplicaSet?', options: ['Replicas of pods', 'Database', 'IDE', 'None'], correctAnswer: 'Replicas of pods' },
                    { id: 12, text: 'What is StatefulSet?', options: ['Stateful pods', 'Database', 'IDE', 'None'], correctAnswer: 'Stateful pods' },
                    { id: 13, text: 'What is DaemonSet?', options: ['Daemon pods', 'Database', 'IDE', 'None'], correctAnswer: 'Daemon pods' },
                    { id: 14, text: 'What is Job?', options: ['Batch job', 'Database', 'IDE', 'None'], correctAnswer: 'Batch job' },
                    { id: 15, text: 'What is CronJob?', options: ['Scheduled job', 'Database', 'IDE', 'None'], correctAnswer: 'Scheduled job' },
                    { id: 16, text: 'What is Ingress?', options: ['HTTP routing', 'Database', 'IDE', 'None'], correctAnswer: 'HTTP routing' },
                    { id: 17, text: 'What is ConfigMap?', options: ['Config data', 'Database', 'IDE', 'None'], correctAnswer: 'Config data' },
                    { id: 18, text: 'What is Secret?', options: ['Sensitive data', 'Database', 'IDE', 'None'], correctAnswer: 'Sensitive data' },
                    { id: 19, text: 'What is Helm?', options: ['Package manager', 'Database', 'IDE', 'None'], correctAnswer: 'Package manager' },
                    { id: 20, text: 'What is Taint?', options: ['Node restriction', 'Database', 'IDE', 'None'], correctAnswer: 'Node restriction' }
                ],
                high: [
                    { id: 21, text: 'What is Operator?', options: ['App automation', 'Database', 'IDE', 'None'], correctAnswer: 'App automation' },
                    { id: 22, text: 'What is Custom Resource?', options: ['Extend API', 'Database', 'IDE', 'None'], correctAnswer: 'Extend API' },
                    { id: 23, text: 'What is Admission Controller?', options: ['Validate requests', 'Database', 'IDE', 'None'], correctAnswer: 'Validate requests' },
                    { id: 24, text: 'What is API Server?', options: ['Cluster gateway', 'Database', 'IDE', 'None'], correctAnswer: 'Cluster gateway' },
                    { id: 25, text: 'What is Scheduler?', options: ['Assign pods', 'Database', 'IDE', 'None'], correctAnswer: 'Assign pods' },
                    { id: 26, text: 'What is Controller Manager?', options: ['Control loop', 'Database', 'IDE', 'None'], correctAnswer: 'Control loop' },
                    { id: 27, text: 'What is ResourceQuota?', options: ['Resource limit', 'Database', 'IDE', 'None'], correctAnswer: 'Resource limit' },
                    { id: 28, text: 'What is PodDisruptionBudget?', options: ['Pod availability', 'Database', 'IDE', 'None'], correctAnswer: 'Pod availability' },
                    { id: 29, text: 'What is NetworkPolicy?', options: ['Network rules', 'Database', 'IDE', 'None'], correctAnswer: 'Network rules' },
                    { id: 30, text: 'What is kube-proxy?', options: ['Network proxy', 'Database', 'IDE', 'None'], correctAnswer: 'Network proxy' }
                ]
            },
            "linux": {
                low: [
                    { id: 1, text: 'What is Linux?', options: ['OS', 'Database', 'IDE', 'None'], correctAnswer: 'OS' },
                    { id: 2, text: 'Who created Linux?', options: ['Linus Torvalds', 'Bill Gates', 'Steve Jobs', 'Mark Zuckerberg'], correctAnswer: 'Linus Torvalds' },
                    { id: 3, text: 'What is the kernel?', options: ['Core of OS', 'Shell', 'App', 'None'], correctAnswer: 'Core of OS' },
                    { id: 4, text: 'What is a shell?', options: ['Command interface', 'Kernel', 'App', 'None'], correctAnswer: 'Command interface' },
                    { id: 5, text: 'What is a terminal?', options: ['Command line', 'GUI', 'App', 'None'], correctAnswer: 'Command line' },
                    { id: 6, text: 'What is a distro?', options: ['Distribution', 'App', 'Kernel', 'None'], correctAnswer: 'Distribution' },
                    { id: 7, text: 'What is root?', options: ['Admin user', 'Normal user', 'App', 'None'], correctAnswer: 'Admin user' },
                    { id: 8, text: 'What is sudo?', options: ['Superuser do', 'Normal user', 'App', 'None'], correctAnswer: 'Superuser do' },
                    { id: 9, text: 'What is home directory?', options: ['User folder', 'System folder', 'App', 'None'], correctAnswer: 'User folder' },
                    { id: 10, text: 'What is pwd?', options: ['Print working dir', 'Print word', 'Print window', 'None'], correctAnswer: 'Print working dir' }
                ],
                medium: [
                    { id: 11, text: 'What is ls?', options: ['List files', 'List users', 'List apps', 'None'], correctAnswer: 'List files' },
                    { id: 12, text: 'What is cd?', options: ['Change dir', 'Change file', 'Change app', 'None'], correctAnswer: 'Change dir' },
                    { id: 13, text: 'What is cp?', options: ['Copy file', 'Copy dir', 'Copy app', 'None'], correctAnswer: 'Copy file' },
                    { id: 14, text: 'What is mv?', options: ['Move file', 'Move dir', 'Move app', 'None'], correctAnswer: 'Move file' },
                    { id: 15, text: 'What is rm?', options: ['Remove file', 'Remove dir', 'Remove app', 'None'], correctAnswer: 'Remove file' },
                    { id: 16, text: 'What is chmod?', options: ['Change mode', 'Change dir', 'Change app', 'None'], correctAnswer: 'Change mode' },
                    { id: 17, text: 'What is chown?', options: ['Change owner', 'Change group', 'Change app', 'None'], correctAnswer: 'Change owner' },
                    { id: 18, text: 'What is ps?', options: ['Process status', 'Print status', 'Print shell', 'None'], correctAnswer: 'Process status' },
                    { id: 19, text: 'What is kill?', options: ['Terminate process', 'Terminate app', 'Terminate user', 'None'], correctAnswer: 'Terminate process' },
                    { id: 20, text: 'What is grep?', options: ['Search text', 'Search file', 'Search app', 'None'], correctAnswer: 'Search text' }
                ],
                high: [
                    { id: 21, text: 'What is awk?', options: ['Text processing', 'Text editing', 'Text searching', 'None'], correctAnswer: 'Text processing' },
                    { id: 22, text: 'What is sed?', options: ['Stream editor', 'Text editor', 'Text search', 'None'], correctAnswer: 'Stream editor' },
                    { id: 23, text: 'What is cron?', options: ['Job scheduler', 'Job runner', 'Job stopper', 'None'], correctAnswer: 'Job scheduler' },
                    { id: 24, text: 'What is systemd?', options: ['Init system', 'System daemon', 'System process', 'None'], correctAnswer: 'Init system' },
                    { id: 25, text: 'What is journalctl?', options: ['Log viewer', 'Log editor', 'Log search', 'None'], correctAnswer: 'Log viewer' },
                    { id: 26, text: 'What is ssh?', options: ['Secure shell', 'Simple shell', 'Super shell', 'None'], correctAnswer: 'Secure shell' },
                    { id: 27, text: 'What is scp?', options: ['Secure copy', 'Simple copy', 'Super copy', 'None'], correctAnswer: 'Secure copy' },
                    { id: 28, text: 'What is tar?', options: ['Archive tool', 'Archive file', 'Archive dir', 'None'], correctAnswer: 'Archive tool' },
                    { id: 29, text: 'What is top?', options: ['Process monitor', 'Process killer', 'Process starter', 'None'], correctAnswer: 'Process monitor' },
                    { id: 30, text: 'What is man?', options: ['Manual', 'Manager', 'Manifest', 'None'], correctAnswer: 'Manual' }
                ]
            },
            "asp.net": {
                low: [
                    { id: 1, text: 'What is ASP.NET?', options: ['Web framework', 'Database', 'IDE', 'OS'], correctAnswer: 'Web framework' },
                    { id: 2, text: 'Which company developed ASP.NET?', options: ['Microsoft', 'Google', 'Apple', 'IBM'], correctAnswer: 'Microsoft' },
                    { id: 3, text: 'What language is commonly used with ASP.NET?', options: ['C#', 'Java', 'Python', 'PHP'], correctAnswer: 'C#' },
                    { id: 4, text: 'What is the default file extension for ASP.NET web forms?', options: ['.aspx', '.html', '.js', '.css'], correctAnswer: '.aspx' },
                    { id: 5, text: 'What is ViewState?', options: ['State management', 'Database', 'IDE', 'None'], correctAnswer: 'State management' },
                    { id: 6, text: 'What is a PostBack?', options: ['Page reload', 'Database', 'IDE', 'None'], correctAnswer: 'Page reload' },
                    { id: 7, text: 'What is a Master Page?', options: ['Layout template', 'Database', 'IDE', 'None'], correctAnswer: 'Layout template' },
                    { id: 8, text: 'What is Web.config?', options: ['Configuration file', 'Database', 'IDE', 'None'], correctAnswer: 'Configuration file' },
                    { id: 9, text: 'What is IIS?', options: ['Web server', 'Database', 'IDE', 'None'], correctAnswer: 'Web server' },
                    { id: 10, text: 'What is a User Control?', options: ['Reusable component', 'Database', 'IDE', 'None'], correctAnswer: 'Reusable component' }
                ],
                medium: [
                    { id: 11, text: 'What is MVC in ASP.NET?', options: ['Design pattern', 'Database', 'IDE', 'None'], correctAnswer: 'Design pattern' },
                    { id: 12, text: 'What is Razor?', options: ['View engine', 'Database', 'IDE', 'None'], correctAnswer: 'View engine' },
                    { id: 13, text: 'What is a Partial View?', options: ['Reusable view', 'Database', 'IDE', 'None'], correctAnswer: 'Reusable view' },
                    { id: 14, text: 'What is TempData?', options: ['Data storage', 'Database', 'IDE', 'None'], correctAnswer: 'Data storage' },
                    { id: 15, text: 'What is Bundling?', options: ['Combine files', 'Database', 'IDE', 'None'], correctAnswer: 'Combine files' },
                    { id: 16, text: 'What is Minification?', options: ['Reduce file size', 'Database', 'IDE', 'None'], correctAnswer: 'Reduce file size' },
                    { id: 17, text: 'What is ActionResult?', options: ['Return type', 'Database', 'IDE', 'None'], correctAnswer: 'Return type' },
                    { id: 18, text: 'What is Routing?', options: ['URL mapping', 'Database', 'IDE', 'None'], correctAnswer: 'URL mapping' },
                    { id: 19, text: 'What is Attribute Routing?', options: ['Route by attribute', 'Database', 'IDE', 'None'], correctAnswer: 'Route by attribute' },
                    { id: 20, text: 'What is Dependency Injection?', options: ['Inject dependencies', 'Database', 'IDE', 'None'], correctAnswer: 'Inject dependencies' }
                ],
                high: [
                    { id: 21, text: 'What is SignalR?', options: ['Real-time communication', 'Database', 'IDE', 'None'], correctAnswer: 'Real-time communication' },
                    { id: 22, text: 'What is Middleware?', options: ['Request pipeline', 'Database', 'IDE', 'None'], correctAnswer: 'Request pipeline' },
                    { id: 23, text: 'What is OWIN?', options: ['Open Web Interface', 'Database', 'IDE', 'None'], correctAnswer: 'Open Web Interface' },
                    { id: 24, text: 'What is Kestrel?', options: ['Web server', 'Database', 'IDE', 'None'], correctAnswer: 'Web server' },
                    { id: 25, text: 'What is Entity Framework?', options: ['ORM', 'Database', 'IDE', 'None'], correctAnswer: 'ORM' },
                    { id: 26, text: 'What is Web API?', options: ['API framework', 'Database', 'IDE', 'None'], correctAnswer: 'API framework' },
                    { id: 27, text: 'What is Claims-based authentication?', options: ['Auth method', 'Database', 'IDE', 'None'], correctAnswer: 'Auth method' },
                    { id: 28, text: 'What is JWT?', options: ['Token', 'Database', 'IDE', 'None'], correctAnswer: 'Token' },
                    { id: 29, text: 'What is CORS?', options: ['Cross-origin', 'Database', 'IDE', 'None'], correctAnswer: 'Cross-origin' },
                    { id: 30, text: 'What is .NET Core?', options: ['Cross-platform', 'Database', 'IDE', 'None'], correctAnswer: 'Cross-platform' }
                ]
            },
            "c#.net": {
                low: [
                    { id: 1, text: 'What is C#?', options: ['Programming language', 'Database', 'IDE', 'None'], correctAnswer: 'Programming language' },
                    { id: 2, text: 'Which company developed C#?', options: ['Microsoft', 'Apple', 'Google', 'IBM'], correctAnswer: 'Microsoft' },
                    { id: 3, text: 'What is the file extension for C# source files?', options: ['.cs', '.java', '.cpp', '.py'], correctAnswer: '.cs' },
                    { id: 4, text: 'Which keyword is used to define a class in C#?', options: ['class', 'struct', 'interface', 'enum'], correctAnswer: 'class' },
                    { id: 5, text: 'Which method is the entry point of a C# application?', options: ['Main', 'Start', 'Init', 'Run'], correctAnswer: 'Main' },
                    { id: 6, text: 'Which symbol is used for single-line comments in C#?', options: ['//', '#', '--', '/*'], correctAnswer: '//' },
                    { id: 7, text: 'Which of these is a value type in C#?', options: ['int', 'string', 'object', 'array'], correctAnswer: 'int' },
                    { id: 8, text: 'Which IDE is most commonly used for C# development?', options: ['Visual Studio', 'Eclipse', 'NetBeans', 'PyCharm'], correctAnswer: 'Visual Studio' },
                    { id: 9, text: 'Which framework is used for C# web applications?', options: ['ASP.NET', 'Django', 'Spring', 'Laravel'], correctAnswer: 'ASP.NET' },
                    { id: 10, text: 'Which keyword is used to inherit a class in C#?', options: [':', 'extends', 'inherits', '->'], correctAnswer: ':' }
                ],
                medium: [
                    { id: 11, text: 'What is the CLR?', options: ['Common Language Runtime', 'Common Language Resource', 'Class Library Runtime', 'None'], correctAnswer: 'Common Language Runtime' },
                    { id: 12, text: 'Which is not a C# access modifier?', options: ['public', 'private', 'protected', 'internal'], correctAnswer: 'internal' },
                    { id: 13, text: 'Which is a C# collection?', options: ['List', 'Set', 'Dictionary', 'All of these'], correctAnswer: 'All of these' },
                    { id: 14, text: 'Which is a C# interface?', options: ['IDisposable', 'ArrayList', 'HashMap', 'String'], correctAnswer: 'IDisposable' },
                    { id: 15, text: 'Which is a C# exception?', options: ['NullReferenceException', 'TypeError', 'SyntaxError', 'None'], correctAnswer: 'NullReferenceException' },
                    { id: 16, text: 'Which is a C# loop?', options: ['for', 'repeat', 'foreach', 'loop'], correctAnswer: 'for' },
                    { id: 17, text: 'Which is a C# namespace?', options: ['System', 'Java', 'Python', 'None'], correctAnswer: 'System' },
                    { id: 18, text: 'Which is a C# method?', options: ['ToString()', 'Parse()', 'Split()', 'All of these'], correctAnswer: 'All of these' },
                    { id: 19, text: 'Which is a C# thread method?', options: ['Start()', 'Run()', 'Sleep()', 'All of these'], correctAnswer: 'All of these' },
                    { id: 20, text: 'Which is a C# attribute?', options: ['[Obsolete]', '[Test]', '[Serializable]', 'All of these'], correctAnswer: 'All of these' }
                ],
                high: [
                    { id: 21, text: 'What is polymorphism?', options: ['Many forms', 'Single form', 'No form', 'None'], correctAnswer: 'Many forms' },
                    { id: 22, text: 'What is encapsulation?', options: ['Data hiding', 'Data showing', 'Data deleting', 'None'], correctAnswer: 'Data hiding' },
                    { id: 23, text: 'What is inheritance?', options: ['Reuse', 'Delete', 'Copy', 'None'], correctAnswer: 'Reuse' },
                    { id: 24, text: 'What is abstraction?', options: ['Hiding details', 'Showing details', 'Copying', 'None'], correctAnswer: 'Hiding details' },
                    { id: 25, text: 'What is an abstract class?', options: ['Cannot be instantiated', 'Can be instantiated', 'None', 'All'], correctAnswer: 'Cannot be instantiated' },
                    { id: 26, text: 'What is an interface?', options: ['Contract', 'Class', 'Object', 'None'], correctAnswer: 'Contract' },
                    { id: 27, text: 'What is a lambda in C#?', options: ['Anonymous function', 'Class', 'Loop', 'Object'], correctAnswer: 'Anonymous function' },
                    { id: 28, text: 'What is a stream?', options: ['Sequence of elements', 'Array', 'Class', 'None'], correctAnswer: 'Sequence of elements' },
                    { id: 29, text: 'What is serialization?', options: ['Convert object to byte', 'Convert byte to object', 'None', 'All'], correctAnswer: 'Convert object to byte' },
                    { id: 30, text: 'What is the output of 2+2*2?', options: ['6', '8', '4', '2'], correctAnswer: '6' }
                ]
            },
            "java": {
                low: [
                    { id: 1, text: 'What is Java?', options: ['Programming language', 'Database', 'IDE', 'None'], correctAnswer: 'Programming language' },
                    { id: 2, text: 'Which company developed Java?', options: ['Sun Microsystems', 'Microsoft', 'Apple', 'IBM'], correctAnswer: 'Sun Microsystems' },
                    { id: 3, text: 'What is the file extension for Java source files?', options: ['.java', '.class', '.js', '.py'], correctAnswer: '.java' },
                    { id: 4, text: 'Which keyword is used to define a class in Java?', options: ['class', 'struct', 'interface', 'enum'], correctAnswer: 'class' },
                    { id: 5, text: 'Which method is the entry point of a Java application?', options: ['main', 'start', 'init', 'run'], correctAnswer: 'main' },
                    { id: 6, text: 'Which symbol is used for single-line comments in Java?', options: ['//', '#', '--', '/*'], correctAnswer: '//' },
                    { id: 7, text: 'Which of these is a value type in Java?', options: ['int', 'String', 'Object', 'array'], correctAnswer: 'int' },
                    { id: 8, text: 'Which IDE is most commonly used for Java development?', options: ['Eclipse', 'Visual Studio', 'NetBeans', 'PyCharm'], correctAnswer: 'Eclipse' },
                    { id: 9, text: 'Which framework is used for Java web applications?', options: ['Spring', 'Django', 'ASP.NET', 'Laravel'], correctAnswer: 'Spring' },
                    { id: 10, text: 'Which keyword is used to inherit a class in Java?', options: ['extends', ':', 'inherits', '->'], correctAnswer: 'extends' }
                ],
                medium: [
                    { id: 11, text: 'What is the JVM?', options: ['Java Virtual Machine', 'Java Variable Method', 'Java Version Manager', 'None'], correctAnswer: 'Java Virtual Machine' },
                    { id: 12, text: 'Which is not a Java access modifier?', options: ['public', 'private', 'protected', 'internal'], correctAnswer: 'internal' },
                    { id: 13, text: 'Which is a Java collection?', options: ['List', 'Set', 'Map', 'All of these'], correctAnswer: 'All of these' },
                    { id: 14, text: 'Which is a Java interface?', options: ['Serializable', 'ArrayList', 'HashMap', 'String'], correctAnswer: 'Serializable' },
                    { id: 15, text: 'Which is a Java exception?', options: ['NullPointerException', 'TypeError', 'SyntaxError', 'None'], correctAnswer: 'NullPointerException' },
                    { id: 16, text: 'Which is a Java loop?', options: ['for', 'repeat', 'foreach', 'loop'], correctAnswer: 'for' },
                    { id: 17, text: 'Which is a Java package?', options: ['java.util', 'System', 'Python', 'None'], correctAnswer: 'java.util' },
                    { id: 18, text: 'Which is a Java method?', options: ['toString()', 'parseInt()', 'split()', 'All of these'], correctAnswer: 'All of these' },
                    { id: 19, text: 'Which is a Java thread method?', options: ['start()', 'run()', 'sleep()', 'All of these'], correctAnswer: 'All of these' },
                    { id: 20, text: 'Which is a Java annotation?', options: ['@Override', '@Test', '@Serializable', 'All of these'], correctAnswer: 'All of these' }
                ],
                high: [
                    { id: 21, text: 'What is polymorphism?', options: ['Many forms', 'Single form', 'No form', 'None'], correctAnswer: 'Many forms' },
                    { id: 22, text: 'What is encapsulation?', options: ['Data hiding', 'Data showing', 'Data deleting', 'None'], correctAnswer: 'Data hiding' },
                    { id: 23, text: 'What is inheritance?', options: ['Reuse', 'Delete', 'Copy', 'None'], correctAnswer: 'Reuse' },
                    { id: 24, text: 'What is abstraction?', options: ['Hiding details', 'Showing details', 'Copying', 'None'], correctAnswer: 'Hiding details' },
                    { id: 25, text: 'What is an abstract class?', options: ['Cannot be instantiated', 'Can be instantiated', 'None', 'All'], correctAnswer: 'Cannot be instantiated' },
                    { id: 26, text: 'What is an interface?', options: ['Contract', 'Class', 'Object', 'None'], correctAnswer: 'Contract' },
                    { id: 27, text: 'What is a lambda in Java?', options: ['Anonymous function', 'Class', 'Loop', 'Object'], correctAnswer: 'Anonymous function' },
                    { id: 28, text: 'What is a stream?', options: ['Sequence of elements', 'Array', 'Class', 'None'], correctAnswer: 'Sequence of elements' },
                    { id: 29, text: 'What is serialization?', options: ['Convert object to byte', 'Convert byte to object', 'None', 'All'], correctAnswer: 'Convert object to byte' },
                    { id: 30, text: 'What is the output of 2+2*2?', options: ['6', '8', '4', '2'], correctAnswer: '6' }
                ]
            },
            "javascript": {
                low: [
                    { id: 1, text: 'What is JavaScript?', options: ['Programming language', 'Database', 'IDE', 'None'], correctAnswer: 'Programming language' },
                    { id: 2, text: 'Which company developed JavaScript?', options: ['Netscape', 'Microsoft', 'Apple', 'IBM'], correctAnswer: 'Netscape' },
                    { id: 3, text: 'What is the file extension for JavaScript files?', options: ['.js', '.java', '.jsx', '.ts'], correctAnswer: '.js' },
                    { id: 4, text: 'Which keyword declares a variable?', options: ['var', 'int', 'let', 'const'], correctAnswer: 'var' },
                    { id: 5, text: 'Which symbol is used for single-line comments?', options: ['//', '#', '--', '/*'], correctAnswer: '//' },
                    { id: 6, text: 'Which method alerts a message?', options: ['alert()', 'msg()', 'prompt()', 'show()'], correctAnswer: 'alert()' },
                    { id: 7, text: 'Which is a JavaScript framework?', options: ['React', 'Django', 'Spring', 'Laravel'], correctAnswer: 'React' },
                    { id: 8, text: 'Which operator is used for addition?', options: ['+', '-', '*', '/'], correctAnswer: '+' },
                    { id: 9, text: 'Which is a boolean value?', options: ['true', 'yes', '1', 'on'], correctAnswer: 'true' },
                    { id: 10, text: 'Which is a loop in JavaScript?', options: ['for', 'repeat', 'foreach', 'loop'], correctAnswer: 'for' }
                ],
                medium: [
                    { id: 11, text: 'What is closure?', options: ['Function with scope', 'Class', 'Object', 'None'], correctAnswer: 'Function with scope' },
                    { id: 12, text: 'What is hoisting?', options: ['Variable lifting', 'Variable lowering', 'None', 'All'], correctAnswer: 'Variable lifting' },
                    { id: 13, text: 'What is NaN?', options: ['Not a Number', 'New Array Node', 'None', 'All'], correctAnswer: 'Not a Number' },
                    { id: 14, text: 'What is typeof null?', options: ['object', 'null', 'undefined', 'None'], correctAnswer: 'object' },
                    { id: 15, text: 'What is === operator?', options: ['Strict equality', 'Loose equality', 'None', 'All'], correctAnswer: 'Strict equality' },
                    { id: 16, text: 'What is event bubbling?', options: ['Event propagation', 'Event stopping', 'None', 'All'], correctAnswer: 'Event propagation' },
                    { id: 17, text: 'What is setTimeout?', options: ['Delay function', 'Immediate function', 'None', 'All'], correctAnswer: 'Delay function' },
                    { id: 18, text: 'What is JSON?', options: ['Data format', 'Database', 'IDE', 'None'], correctAnswer: 'Data format' },
                    { id: 19, text: 'What is a promise?', options: ['Async object', 'Sync object', 'None', 'All'], correctAnswer: 'Async object' },
                    { id: 20, text: 'What is localStorage?', options: ['Browser storage', 'Server storage', 'None', 'All'], correctAnswer: 'Browser storage' }
                ],
                high: [
                    { id: 21, text: 'What is prototype?', options: ['Object property', 'Class', 'Function', 'None'], correctAnswer: 'Object property' },
                    { id: 22, text: 'What is async/await?', options: ['Async syntax', 'Sync syntax', 'None', 'All'], correctAnswer: 'Async syntax' },
                    { id: 23, text: 'What is a generator?', options: ['Function that yields', 'Class', 'Object', 'None'], correctAnswer: 'Function that yields' },
                    { id: 24, text: 'What is Symbol?', options: ['Primitive type', 'Object', 'Class', 'None'], correctAnswer: 'Primitive type' },
                    { id: 25, text: 'What is Map?', options: ['Key-value collection', 'Array', 'Class', 'None'], correctAnswer: 'Key-value collection' },
                    { id: 26, text: 'What is Set?', options: ['Unique values', 'Array', 'Class', 'None'], correctAnswer: 'Unique values' },
                    { id: 27, text: 'What is destructuring?', options: ['Unpacking values', 'Packing values', 'None', 'All'], correctAnswer: 'Unpacking values' },
                    { id: 28, text: 'What is a module?', options: ['Reusable code', 'Class', 'Object', 'None'], correctAnswer: 'Reusable code' },
                    { id: 29, text: 'What is debounce?', options: ['Delay execution', 'Immediate execution', 'None', 'All'], correctAnswer: 'Delay execution' },
                    { id: 30, text: 'What is currying?', options: ['Function transformation', 'Object transformation', 'None', 'All'], correctAnswer: 'Function transformation' }
                ]
            },
            "css": {
                low: [
                    { id: 1, text: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets' },
                    { id: 2, text: 'Which symbol is used for class selector?', options: ['.', '#', '*', '$'], correctAnswer: '.' },
                    { id: 3, text: 'Which property sets text color?', options: ['color', 'background', 'font', 'text'], correctAnswer: 'color' },
                    { id: 4, text: 'Which property sets background color?', options: ['background', 'color', 'font', 'text'], correctAnswer: 'background' },
                    { id: 5, text: 'Which property sets font size?', options: ['font-size', 'font', 'size', 'text-size'], correctAnswer: 'font-size' },
                    { id: 6, text: 'Which property sets margin?', options: ['margin', 'padding', 'border', 'gap'], correctAnswer: 'margin' },
                    { id: 7, text: 'Which property sets padding?', options: ['padding', 'margin', 'border', 'gap'], correctAnswer: 'padding' },
                    { id: 8, text: 'Which property sets border?', options: ['border', 'margin', 'padding', 'gap'], correctAnswer: 'border' },
                    { id: 9, text: 'Which property sets width?', options: ['width', 'height', 'size', 'length'], correctAnswer: 'width' },
                    { id: 10, text: 'Which property sets height?', options: ['height', 'width', 'size', 'length'], correctAnswer: 'height' }
                ],
                medium: [
                    { id: 11, text: 'What is a CSS selector?', options: ['Pattern to select elements', 'Pattern to select classes', 'Pattern to select ids', 'None'], correctAnswer: 'Pattern to select elements' },
                    { id: 12, text: 'What is specificity?', options: ['Selector priority', 'Selector order', 'Selector type', 'None'], correctAnswer: 'Selector priority' },
                    { id: 13, text: 'What is !important?', options: ['Overrides all', 'Overrides none', 'None', 'All'], correctAnswer: 'Overrides all' },
                    { id: 14, text: 'What is a pseudo-class?', options: ['Special state', 'Special element', 'None', 'All'], correctAnswer: 'Special state' },
                    { id: 15, text: 'What is a pseudo-element?', options: ['Part of element', 'Whole element', 'None', 'All'], correctAnswer: 'Part of element' },
                    { id: 16, text: 'What is a media query?', options: ['Responsive design', 'Static design', 'None', 'All'], correctAnswer: 'Responsive design' },
                    { id: 17, text: 'What is flexbox?', options: ['Layout model', 'Color model', 'None', 'All'], correctAnswer: 'Layout model' },
                    { id: 18, text: 'What is grid?', options: ['Layout system', 'Color system', 'None', 'All'], correctAnswer: 'Layout system' },
                    { id: 19, text: 'What is z-index?', options: ['Stack order', 'Stack size', 'None', 'All'], correctAnswer: 'Stack order' },
                    { id: 20, text: 'What is box-sizing?', options: ['Box model', 'Box color', 'None', 'All'], correctAnswer: 'Box model' }
                ],
                high: [
                    { id: 21, text: 'What is CSS preprocessor?', options: ['Tool for CSS', 'Tool for HTML', 'None', 'All'], correctAnswer: 'Tool for CSS' },
                    { id: 22, text: 'What is SASS?', options: ['CSS preprocessor', 'HTML preprocessor', 'None', 'All'], correctAnswer: 'CSS preprocessor' },
                    { id: 23, text: 'What is LESS?', options: ['CSS preprocessor', 'HTML preprocessor', 'None', 'All'], correctAnswer: 'CSS preprocessor' },
                    { id: 24, text: 'What is BEM?', options: ['Naming convention', 'CSS framework', 'None', 'All'], correctAnswer: 'Naming convention' },
                    { id: 25, text: 'What is CSS-in-JS?', options: ['CSS in JavaScript', 'CSS in HTML', 'None', 'All'], correctAnswer: 'CSS in JavaScript' },
                    { id: 26, text: 'What is @media?', options: ['Media query', 'Media element', 'None', 'All'], correctAnswer: 'Media query' },
                    { id: 27, text: 'What is @import?', options: ['Import CSS', 'Import HTML', 'None', 'All'], correctAnswer: 'Import CSS' },
                    { id: 28, text: 'What is calc()?', options: ['Calculation', 'Color', 'None', 'All'], correctAnswer: 'Calculation' },
                    { id: 29, text: 'What is rem unit?', options: ['Root em', 'Relative em', 'None', 'All'], correctAnswer: 'Root em' },
                    { id: 30, text: 'What is vh unit?', options: ['Viewport height', 'Viewport width', 'None', 'All'], correctAnswer: 'Viewport height' }
                ]
            },
            "html": {
                low: [
                    { id: 1, text: 'What does HTML stand for?', options: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'None'], correctAnswer: 'HyperText Markup Language' },
                    { id: 2, text: 'What is the correct file extension for HTML files?', options: ['.html', '.htm', '.xhtml', '.xml'], correctAnswer: '.html' },
                    { id: 3, text: 'What is the root element of an HTML page?', options: ['<html>', '<head>', '<body>', '<title>'], correctAnswer: '<html>' },
                    { id: 4, text: 'Which tag creates a hyperlink?', options: ['<a>', '<link>', '<href>', '<url>'], correctAnswer: '<a>' },
                    { id: 5, text: 'Which tag creates a line break?', options: ['<br>', '<lb>', '<break>', '<line>'], correctAnswer: '<br>' },
                    { id: 6, text: 'Which tag creates a paragraph?', options: ['<p>', '<para>', '<pg>', '<text>'], correctAnswer: '<p>' },
                    { id: 7, text: 'Which tag creates a table?', options: ['<table>', '<tab>', '<tbl>', '<tb>'], correctAnswer: '<table>' },
                    { id: 8, text: 'Which tag creates a list?', options: ['<ul>', '<ol>', '<li>', '<dl>'], correctAnswer: '<ul>' },
                    { id: 9, text: 'Which tag creates an image?', options: ['<img>', '<image>', '<pic>', '<src>'], correctAnswer: '<img>' },
                    { id: 10, text: 'Which tag creates a heading?', options: ['<h1>', '<head>', '<header>', '<h>'], correctAnswer: '<h1>' }
                ],
                medium: [
                    { id: 11, text: 'What is the <head> tag for?', options: ['Metadata', 'Content', 'Footer', 'None'], correctAnswer: 'Metadata' },
                    { id: 12, text: 'What is the <body> tag for?', options: ['Content', 'Metadata', 'Footer', 'None'], correctAnswer: 'Content' },
                    { id: 13, text: 'What is the <title> tag for?', options: ['Page title', 'Page content', 'Page footer', 'None'], correctAnswer: 'Page title' },
                    { id: 14, text: 'What is the <form> tag for?', options: ['User input', 'User output', 'User data', 'None'], correctAnswer: 'User input' },
                    { id: 15, text: 'What is the <input> tag for?', options: ['Input field', 'Output field', 'Data field', 'None'], correctAnswer: 'Input field' },
                    { id: 16, text: 'What is the <div> tag for?', options: ['Division', 'Section', 'None', 'All'], correctAnswer: 'Division' },
                    { id: 17, text: 'What is the <span> tag for?', options: ['Inline section', 'Block section', 'None', 'All'], correctAnswer: 'Inline section' },
                    { id: 18, text: 'What is the <meta> tag for?', options: ['Metadata', 'Content', 'None', 'All'], correctAnswer: 'Metadata' },
                    { id: 19, text: 'What is the <link> tag for?', options: ['External resource', 'Internal resource', 'None', 'All'], correctAnswer: 'External resource' },
                    { id: 20, text: 'What is the <script> tag for?', options: ['JavaScript', 'CSS', 'None', 'All'], correctAnswer: 'JavaScript' }
                ],
                high: [
                    { id: 21, text: 'What is semantic HTML?', options: ['Meaningful tags', 'Non-meaningful tags', 'None', 'All'], correctAnswer: 'Meaningful tags' },
                    { id: 22, text: 'What is ARIA?', options: ['Accessibility', 'Animation', 'None', 'All'], correctAnswer: 'Accessibility' },
                    { id: 23, text: 'What is the <canvas> tag for?', options: ['Drawing', 'Writing', 'None', 'All'], correctAnswer: 'Drawing' },
                    { id: 24, text: 'What is the <svg> tag for?', options: ['Vector graphics', 'Raster graphics', 'None', 'All'], correctAnswer: 'Vector graphics' },
                    { id: 25, text: 'What is the <iframe> tag for?', options: ['Embed page', 'Embed image', 'None', 'All'], correctAnswer: 'Embed page' },
                    { id: 26, text: 'What is the <audio> tag for?', options: ['Audio', 'Video', 'None', 'All'], correctAnswer: 'Audio' },
                    { id: 27, text: 'What is the <video> tag for?', options: ['Video', 'Audio', 'None', 'All'], correctAnswer: 'Video' },
                    { id: 28, text: 'What is the <source> tag for?', options: ['Media source', 'Media output', 'None', 'All'], correctAnswer: 'Media source' },
                    { id: 29, text: 'What is the <noscript> tag for?', options: ['No JavaScript', 'No CSS', 'None', 'All'], correctAnswer: 'No JavaScript' },
                    { id: 30, text: 'What is the <template> tag for?', options: ['Template content', 'Template style', 'None', 'All'], correctAnswer: 'Template content' }
                ]
            },
            "xml": {
                low: [
                    { id: 1, text: 'What does XML stand for?', options: ['eXtensible Markup Language', 'Extra Markup Language', 'Example Markup Language', 'None'], correctAnswer: 'eXtensible Markup Language' },
                    { id: 2, text: 'What is the file extension for XML files?', options: ['.xml', '.html', '.json', '.js'], correctAnswer: '.xml' },
                    { id: 3, text: 'What is the root element in XML?', options: ['Any tag', '<root>', '<xml>', '<main>'], correctAnswer: 'Any tag' },
                    { id: 4, text: 'Are XML tags case sensitive?', options: ['Yes', 'No', 'Sometimes', 'None'], correctAnswer: 'Yes' },
                    { id: 5, text: 'What is an attribute in XML?', options: ['Property of element', 'Element', 'Tag', 'None'], correctAnswer: 'Property of element' },
                    { id: 6, text: 'What is a well-formed XML?', options: ['Correct syntax', 'Incorrect syntax', 'None', 'All'], correctAnswer: 'Correct syntax' },
                    { id: 7, text: 'What is a valid XML?', options: ['Follows DTD/schema', 'Any XML', 'None', 'All'], correctAnswer: 'Follows DTD/schema' },
                    { id: 8, text: 'What is a DTD?', options: ['Document Type Definition', 'Data Type Definition', 'None', 'All'], correctAnswer: 'Document Type Definition' },
                    { id: 9, text: 'What is an XML namespace?', options: ['Unique names', 'Duplicate names', 'None', 'All'], correctAnswer: 'Unique names' },
                    { id: 10, text: 'What is CDATA?', options: ['Character data', 'Comment data', 'None', 'All'], correctAnswer: 'Character data' }
                ],
                medium: [
                    { id: 11, text: 'What is XSLT?', options: ['Transform XML', 'Validate XML', 'None', 'All'], correctAnswer: 'Transform XML' },
                    { id: 12, text: 'What is XPath?', options: ['Query XML', 'Query HTML', 'None', 'All'], correctAnswer: 'Query XML' },
                    { id: 13, text: 'What is XML Schema?', options: ['Define structure', 'Define style', 'None', 'All'], correctAnswer: 'Define structure' },
                    { id: 14, text: 'What is SOAP?', options: ['Protocol', 'Language', 'None', 'All'], correctAnswer: 'Protocol' },
                    { id: 15, text: 'What is RSS?', options: ['Feed format', 'File format', 'None', 'All'], correctAnswer: 'Feed format' },
                    { id: 16, text: 'What is SVG?', options: ['Vector graphics', 'Raster graphics', 'None', 'All'], correctAnswer: 'Vector graphics' },
                    { id: 17, text: 'What is XML DOM?', options: ['Document Object Model', 'Data Object Model', 'None', 'All'], correctAnswer: 'Document Object Model' },
                    { id: 18, text: 'What is XLink?', options: ['Linking XML', 'Linking HTML', 'None', 'All'], correctAnswer: 'Linking XML' },
                    { id: 19, text: 'What is XPointer?', options: ['Point in XML', 'Point in HTML', 'None', 'All'], correctAnswer: 'Point in XML' },
                    { id: 20, text: 'What is XML parser?', options: ['Read XML', 'Write XML', 'None', 'All'], correctAnswer: 'Read XML' }
                ],
                high: [
                    { id: 21, text: 'What is XML Signature?', options: ['Digital signature', 'Manual signature', 'None', 'All'], correctAnswer: 'Digital signature' },
                    { id: 22, text: 'What is XML Encryption?', options: ['Encrypt XML', 'Encrypt HTML', 'None', 'All'], correctAnswer: 'Encrypt XML' },
                    { id: 23, text: 'What is XQuery?', options: ['Query XML', 'Query HTML', 'None', 'All'], correctAnswer: 'Query XML' },
                    { id: 24, text: 'What is XInclude?', options: ['Include XML', 'Include HTML', 'None', 'All'], correctAnswer: 'Include XML' },
                    { id: 25, text: 'What is XML Base?', options: ['Base URI', 'Base tag', 'None', 'All'], correctAnswer: 'Base URI' },
                    { id: 26, text: 'What is XML Infoset?', options: ['Information set', 'Data set', 'None', 'All'], correctAnswer: 'Information set' },
                    { id: 27, text: 'What is XML canonicalization?', options: ['Standardize XML', 'Standardize HTML', 'None', 'All'], correctAnswer: 'Standardize XML' },
                    { id: 28, text: 'What is XML serialization?', options: ['Convert to string', 'Convert to object', 'None', 'All'], correctAnswer: 'Convert to string' },
                    { id: 29, text: 'What is XML validation?', options: ['Check structure', 'Check style', 'None', 'All'], correctAnswer: 'Check structure' },
                    { id: 30, text: 'What is XML processing instruction?', options: ['Special instruction', 'Normal instruction', 'None', 'All'], correctAnswer: 'Special instruction' }
                ]
            },
            "azure": {
                low: [
                    { id: 1, text: 'What is Microsoft Azure?', options: ['Cloud platform', 'Database', 'IDE', 'None'], correctAnswer: 'Cloud platform' },
                    { id: 2, text: 'Which company owns Azure?', options: ['Microsoft', 'Amazon', 'Google', 'IBM'], correctAnswer: 'Microsoft' },
                    { id: 3, text: 'What is Azure Portal?', options: ['Web UI', 'Database', 'IDE', 'None'], correctAnswer: 'Web UI' },
                    { id: 4, text: 'What is Azure VM?', options: ['Virtual Machine', 'Database', 'IDE', 'None'], correctAnswer: 'Virtual Machine' },
                    { id: 5, text: 'What is Azure Blob Storage?', options: ['Object storage', 'Block storage', 'None', 'All'], correctAnswer: 'Object storage' },
                    { id: 6, text: 'What is Azure SQL Database?', options: ['Database service', 'Web service', 'None', 'All'], correctAnswer: 'Database service' },
                    { id: 7, text: 'What is Azure Function?', options: ['Serverless compute', 'Database', 'None', 'All'], correctAnswer: 'Serverless compute' },
                    { id: 8, text: 'What is Azure App Service?', options: ['Web hosting', 'Database', 'None', 'All'], correctAnswer: 'Web hosting' },
                    { id: 9, text: 'What is Azure Resource Group?', options: ['Resource container', 'Resource item', 'None', 'All'], correctAnswer: 'Resource container' },
                    { id: 10, text: 'What is Azure Subscription?', options: ['Billing unit', 'Resource unit', 'None', 'All'], correctAnswer: 'Billing unit' }
                ],
                medium: [
                    { id: 11, text: 'What is Azure AD?', options: ['Active Directory', 'App Directory', 'None', 'All'], correctAnswer: 'Active Directory' },
                    { id: 12, text: 'What is Azure DevOps?', options: ['DevOps platform', 'Database', 'None', 'All'], correctAnswer: 'DevOps platform' },
                    { id: 13, text: 'What is Azure Logic Apps?', options: ['Workflow automation', 'Database', 'None', 'All'], correctAnswer: 'Workflow automation' },
                    { id: 14, text: 'What is Azure API Management?', options: ['API gateway', 'Database', 'None', 'All'], correctAnswer: 'API gateway' },
                    { id: 15, text: 'What is Azure Cosmos DB?', options: ['NoSQL database', 'SQL database', 'None', 'All'], correctAnswer: 'NoSQL database' },
                    { id: 16, text: 'What is Azure Key Vault?', options: ['Secrets management', 'Database', 'None', 'All'], correctAnswer: 'Secrets management' },
                    { id: 17, text: 'What is Azure CDN?', options: ['Content delivery', 'Database', 'None', 'All'], correctAnswer: 'Content delivery' },
                    { id: 18, text: 'What is Azure Monitor?', options: ['Monitoring', 'Database', 'None', 'All'], correctAnswer: 'Monitoring' },
                    { id: 19, text: 'What is Azure Load Balancer?', options: ['Distribute traffic', 'Database', 'None', 'All'], correctAnswer: 'Distribute traffic' },
                    { id: 20, text: 'What is Azure Virtual Network?', options: ['Network', 'Database', 'None', 'All'], correctAnswer: 'Network' }
                ],
                high: [
                    { id: 21, text: 'What is Azure Kubernetes Service?', options: ['AKS', 'EKS', 'GKE', 'None'], correctAnswer: 'AKS' },
                    { id: 22, text: 'What is Azure Synapse Analytics?', options: ['Analytics service', 'Database', 'None', 'All'], correctAnswer: 'Analytics service' },
                    { id: 23, text: 'What is Azure Databricks?', options: ['Analytics platform', 'Database', 'None', 'All'], correctAnswer: 'Analytics platform' },
                    { id: 24, text: 'What is Azure Data Factory?', options: ['Data integration', 'Database', 'None', 'All'], correctAnswer: 'Data integration' },
                    { id: 25, text: 'What is Azure Event Grid?', options: ['Event routing', 'Database', 'None', 'All'], correctAnswer: 'Event routing' },
                    { id: 26, text: 'What is Azure Service Bus?', options: ['Messaging', 'Database', 'None', 'All'], correctAnswer: 'Messaging' },
                    { id: 27, text: 'What is Azure Logic App connector?', options: ['Integration', 'Database', 'None', 'All'], correctAnswer: 'Integration' },
                    { id: 28, text: 'What is Azure API Gateway?', options: ['API management', 'Database', 'None', 'All'], correctAnswer: 'API management' },
                    { id: 29, text: 'What is Azure Blob trigger?', options: ['Event trigger', 'Database', 'None', 'All'], correctAnswer: 'Event trigger' },
                    { id: 30, text: 'What is Azure Durable Function?', options: ['Orchestration', 'Database', 'None', 'All'], correctAnswer: 'Orchestration' }
                ]
            },
            "rest api": {
                low: [
                    { id: 1, text: 'What does REST stand for?', options: ['Representational State Transfer', 'Remote Execution Service Transfer', 'None', 'All'], correctAnswer: 'Representational State Transfer' },
                    { id: 2, text: 'Which protocol is commonly used with REST?', options: ['HTTP', 'FTP', 'SMTP', 'SSH'], correctAnswer: 'HTTP' },
                    { id: 3, text: 'What is a resource in REST?', options: ['Data entity', 'Database', 'None', 'All'], correctAnswer: 'Data entity' },
                    { id: 4, text: 'What is an endpoint?', options: ['URL', 'Database', 'None', 'All'], correctAnswer: 'URL' },
                    { id: 5, text: 'Which HTTP method is used to retrieve data?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctAnswer: 'GET' },
                    { id: 6, text: 'Which HTTP method is used to create data?', options: ['POST', 'GET', 'PUT', 'DELETE'], correctAnswer: 'POST' },
                    { id: 7, text: 'Which HTTP method is used to update data?', options: ['PUT', 'GET', 'POST', 'DELETE'], correctAnswer: 'PUT' },
                    { id: 8, text: 'Which HTTP method is used to delete data?', options: ['DELETE', 'GET', 'POST', 'PUT'], correctAnswer: 'DELETE' },
                    { id: 9, text: 'What is a status code 200?', options: ['OK', 'Created', 'Bad Request', 'Not Found'], correctAnswer: 'OK' },
                    { id: 10, text: 'What is a status code 404?', options: ['Not Found', 'OK', 'Created', 'Bad Request'], correctAnswer: 'Not Found' }
                ],
                medium: [
                    { id: 11, text: 'What is statelessness in REST?', options: ['No client context stored', 'Client context stored', 'None', 'All'], correctAnswer: 'No client context stored' },
                    { id: 12, text: 'What is idempotency?', options: ['Same result on repeat', 'Different result', 'None', 'All'], correctAnswer: 'Same result on repeat' },
                    { id: 13, text: 'What is a RESTful API?', options: ['Follows REST principles', 'Does not follow REST', 'None', 'All'], correctAnswer: 'Follows REST principles' },
                    { id: 14, text: 'What is JSON?', options: ['Data format', 'Database', 'None', 'All'], correctAnswer: 'Data format' },
                    { id: 15, text: 'What is XML?', options: ['Data format', 'Database', 'None', 'All'], correctAnswer: 'Data format' },
                    { id: 16, text: 'What is a REST client?', options: ['Consumes API', 'Provides API', 'None', 'All'], correctAnswer: 'Consumes API' },
                    { id: 17, text: 'What is a REST server?', options: ['Provides API', 'Consumes API', 'None', 'All'], correctAnswer: 'Provides API' },
                    { id: 18, text: 'What is a REST header?', options: ['Metadata', 'Data', 'None', 'All'], correctAnswer: 'Metadata' },
                    { id: 19, text: 'What is a REST body?', options: ['Payload', 'Header', 'None', 'All'], correctAnswer: 'Payload' },
                    { id: 20, text: 'What is a REST response?', options: ['API reply', 'API request', 'None', 'All'], correctAnswer: 'API reply' }
                ],
                high: [
                    { id: 21, text: 'What is HATEOAS?', options: ['Hypermedia as the Engine of Application State', 'Hypertext Application', 'None', 'All'], correctAnswer: 'Hypermedia as the Engine of Application State' },
                    { id: 22, text: 'What is CORS?', options: ['Cross-Origin Resource Sharing', 'Cross-Origin Request Service', 'None', 'All'], correctAnswer: 'Cross-Origin Resource Sharing' },
                    { id: 23, text: 'What is OAuth?', options: ['Authorization protocol', 'Authentication protocol', 'None', 'All'], correctAnswer: 'Authorization protocol' },
                    { id: 24, text: 'What is OpenAPI?', options: ['API specification', 'API gateway', 'None', 'All'], correctAnswer: 'API specification' },
                    { id: 25, text: 'What is Swagger?', options: ['API documentation', 'API gateway', 'None', 'All'], correctAnswer: 'API documentation' },
                    { id: 26, text: 'What is rate limiting?', options: ['Limit requests', 'Limit responses', 'None', 'All'], correctAnswer: 'Limit requests' },
                    { id: 27, text: 'What is throttling?', options: ['Control traffic', 'Control data', 'None', 'All'], correctAnswer: 'Control traffic' },
                    { id: 28, text: 'What is API versioning?', options: ['Version control', 'Data control', 'None', 'All'], correctAnswer: 'Version control' },
                    { id: 29, text: 'What is endpoint security?', options: ['Protect API', 'Protect client', 'None', 'All'], correctAnswer: 'Protect API' },
                    { id: 30, text: 'What is RESTful error handling?', options: ['Error response', 'Error request', 'None', 'All'], correctAnswer: 'Error response' }
                ]
            },
            "logic apps": {
                low: [
                    { id: 1, text: 'What is Azure Logic Apps?', options: ['Workflow automation', 'Database', 'IDE', 'None'], correctAnswer: 'Workflow automation' },
                    { id: 2, text: 'What is a trigger in Logic Apps?', options: ['Start workflow', 'End workflow', 'None', 'All'], correctAnswer: 'Start workflow' },
                    { id: 3, text: 'What is a connector in Logic Apps?', options: ['Integration', 'Database', 'None', 'All'], correctAnswer: 'Integration' },
                    { id: 4, text: 'What is a workflow?', options: ['Sequence of actions', 'Single action', 'None', 'All'], correctAnswer: 'Sequence of actions' },
                    { id: 5, text: 'What is a run history?', options: ['Execution log', 'Execution plan', 'None', 'All'], correctAnswer: 'Execution log' },
                    { id: 6, text: 'What is a parameter?', options: ['Input value', 'Output value', 'None', 'All'], correctAnswer: 'Input value' },
                    { id: 7, text: 'What is a variable?', options: ['Store value', 'Store action', 'None', 'All'], correctAnswer: 'Store value' },
                    { id: 8, text: 'What is a condition?', options: ['Decision', 'Loop', 'None', 'All'], correctAnswer: 'Decision' },
                    { id: 9, text: 'What is a loop?', options: ['Repeat actions', 'Single action', 'None', 'All'], correctAnswer: 'Repeat actions' },
                    { id: 10, text: 'What is a response action?', options: ['Send response', 'Send request', 'None', 'All'], correctAnswer: 'Send response' }
                ],
                medium: [
                    { id: 11, text: 'What is a built-in connector?', options: ['Native connector', 'Custom connector', 'None', 'All'], correctAnswer: 'Native connector' },
                    { id: 12, text: 'What is a managed connector?', options: ['Microsoft connector', 'Custom connector', 'None', 'All'], correctAnswer: 'Microsoft connector' },
                    { id: 13, text: 'What is a custom connector?', options: ['User-defined', 'Microsoft-defined', 'None', 'All'], correctAnswer: 'User-defined' },
                    { id: 14, text: 'What is a parallel branch?', options: ['Concurrent actions', 'Sequential actions', 'None', 'All'], correctAnswer: 'Concurrent actions' },
                    { id: 15, text: 'What is a scope?', options: ['Group actions', 'Single action', 'None', 'All'], correctAnswer: 'Group actions' },
                    { id: 16, text: 'What is a retry policy?', options: ['Retry on failure', 'Retry on success', 'None', 'All'], correctAnswer: 'Retry on failure' },
                    { id: 17, text: 'What is a tracked property?', options: ['Monitor value', 'Monitor action', 'None', 'All'], correctAnswer: 'Monitor value' },
                    { id: 18, text: 'What is a run after?', options: ['Action dependency', 'Action trigger', 'None', 'All'], correctAnswer: 'Action dependency' },
                    { id: 19, text: 'What is a workflow definition?', options: ['Logic App design', 'Logic App run', 'None', 'All'], correctAnswer: 'Logic App design' },
                    { id: 20, text: 'What is a workflow parameter?', options: ['Input to workflow', 'Output from workflow', 'None', 'All'], correctAnswer: 'Input to workflow' }
                ],
                high: [
                    { id: 21, text: 'What is integration account?', options: ['B2B integration', 'B2C integration', 'None', 'All'], correctAnswer: 'B2B integration' },
                    { id: 22, text: 'What is enterprise connector?', options: ['Advanced connector', 'Basic connector', 'None', 'All'], correctAnswer: 'Advanced connector' },
                    { id: 23, text: 'What is workflow automation?', options: ['Automate process', 'Manual process', 'None', 'All'], correctAnswer: 'Automate process' },
                    { id: 24, text: 'What is workflow orchestration?', options: ['Manage workflows', 'Run workflows', 'None', 'All'], correctAnswer: 'Manage workflows' },
                    { id: 25, text: 'What is workflow trigger?', options: ['Start workflow', 'End workflow', 'None', 'All'], correctAnswer: 'Start workflow' },
                    { id: 26, text: 'What is workflow action?', options: ['Perform task', 'Perform event', 'None', 'All'], correctAnswer: 'Perform task' },
                    { id: 27, text: 'What is workflow run?', options: ['Execution', 'Design', 'None', 'All'], correctAnswer: 'Execution' },
                    { id: 28, text: 'What is workflow status?', options: ['Current state', 'Previous state', 'None', 'All'], correctAnswer: 'Current state' },
                    { id: 29, text: 'What is workflow error?', options: ['Error in run', 'Error in design', 'None', 'All'], correctAnswer: 'Error in run' },
                    { id: 30, text: 'What is workflow analytics?', options: ['Analyze runs', 'Analyze design', 'None', 'All'], correctAnswer: 'Analyze runs' }
                ]
            },
            "api gateway": {
                low: [
                    { id: 1, text: 'What is an API Gateway?', options: ['API management', 'API client', 'None', 'All'], correctAnswer: 'API management' },
                    { id: 2, text: 'What is the main function of API Gateway?', options: ['Route requests', 'Send requests', 'None', 'All'], correctAnswer: 'Route requests' },
                    { id: 3, text: 'What is throttling in API Gateway?', options: ['Limit requests', 'Limit responses', 'None', 'All'], correctAnswer: 'Limit requests' },
                    { id: 4, text: 'What is rate limiting?', options: ['Control traffic', 'Control data', 'None', 'All'], correctAnswer: 'Control traffic' },
                    { id: 5, text: 'What is API key?', options: ['Access token', 'Access code', 'None', 'All'], correctAnswer: 'Access token' },
                    { id: 6, text: 'What is request transformation?', options: ['Modify request', 'Modify response', 'None', 'All'], correctAnswer: 'Modify request' },
                    { id: 7, text: 'What is response transformation?', options: ['Modify response', 'Modify request', 'None', 'All'], correctAnswer: 'Modify response' },
                    { id: 8, text: 'What is caching?', options: ['Store data', 'Delete data', 'None', 'All'], correctAnswer: 'Store data' },
                    { id: 9, text: 'What is authentication?', options: ['Verify user', 'Verify API', 'None', 'All'], correctAnswer: 'Verify user' },
                    { id: 10, text: 'What is authorization?', options: ['Grant access', 'Deny access', 'None', 'All'], correctAnswer: 'Grant access' }
                ],
                medium: [
                    { id: 11, text: 'What is API Gateway endpoint?', options: ['API URL', 'API key', 'None', 'All'], correctAnswer: 'API URL' },
                    { id: 12, text: 'What is custom domain in API Gateway?', options: ['Own domain', 'Shared domain', 'None', 'All'], correctAnswer: 'Own domain' },
                    { id: 13, text: 'What is usage plan?', options: ['API plan', 'API key', 'None', 'All'], correctAnswer: 'API plan' },
                    { id: 14, text: 'What is stage in API Gateway?', options: ['Deployment', 'Development', 'None', 'All'], correctAnswer: 'Deployment' },
                    { id: 15, text: 'What is integration type?', options: ['Backend type', 'Frontend type', 'None', 'All'], correctAnswer: 'Backend type' },
                    { id: 16, text: 'What is mock integration?', options: ['Simulate backend', 'Simulate frontend', 'None', 'All'], correctAnswer: 'Simulate backend' },
                    { id: 17, text: 'What is VPC link?', options: ['Private network', 'Public network', 'None', 'All'], correctAnswer: 'Private network' },
                    { id: 18, text: 'What is request validator?', options: ['Validate request', 'Validate response', 'None', 'All'], correctAnswer: 'Validate request' },
                    { id: 19, text: 'What is response mapping?', options: ['Map response', 'Map request', 'None', 'All'], correctAnswer: 'Map response' },
                    { id: 20, text: 'What is API Gateway logging?', options: ['Log requests', 'Log responses', 'None', 'All'], correctAnswer: 'Log requests' }
                ],
                high: [
                    { id: 21, text: 'What is WebSocket API?', options: ['Real-time API', 'Batch API', 'None', 'All'], correctAnswer: 'Real-time API' },
                    { id: 22, text: 'What is REST API in API Gateway?', options: ['RESTful API', 'SOAP API', 'None', 'All'], correctAnswer: 'RESTful API' },
                    { id: 23, text: 'What is HTTP API in API Gateway?', options: ['HTTP API', 'WebSocket API', 'None', 'All'], correctAnswer: 'HTTP API' },
                    { id: 24, text: 'What is Lambda integration?', options: ['Serverless backend', 'Server backend', 'None', 'All'], correctAnswer: 'Serverless backend' },
                    { id: 25, text: 'What is CORS in API Gateway?', options: ['Cross-Origin Resource Sharing', 'Cross-Origin Request Service', 'None', 'All'], correctAnswer: 'Cross-Origin Resource Sharing' },
                    { id: 26, text: 'What is request throttling?', options: ['Limit requests', 'Limit responses', 'None', 'All'], correctAnswer: 'Limit requests' },
                    { id: 27, text: 'What is API Gateway policy?', options: ['Access control', 'Access log', 'None', 'All'], correctAnswer: 'Access control' },
                    { id: 28, text: 'What is API Gateway authorizer?', options: ['Custom auth', 'Default auth', 'None', 'All'], correctAnswer: 'Custom auth' },
                    { id: 29, text: 'What is API Gateway deployment?', options: ['Release API', 'Release client', 'None', 'All'], correctAnswer: 'Release API' },
                    { id: 30, text: 'What is API Gateway stage variable?', options: ['Config variable', 'Data variable', 'None', 'All'], correctAnswer: 'Config variable' }
                ]
            },
            "function apps": {
                low: [
                    { id: 1, text: 'What is Azure Function App?', options: ['Serverless compute', 'Database', 'IDE', 'None'], correctAnswer: 'Serverless compute' },
                    { id: 2, text: 'What is a function trigger?', options: ['Start function', 'End function', 'None', 'All'], correctAnswer: 'Start function' },
                    { id: 3, text: 'What is a function binding?', options: ['Input/output', 'Input only', 'None', 'All'], correctAnswer: 'Input/output' },
                    { id: 4, text: 'What is a function app plan?', options: ['Hosting plan', 'Database plan', 'None', 'All'], correctAnswer: 'Hosting plan' },
                    { id: 5, text: 'What is a timer trigger?', options: ['Schedule function', 'Manual function', 'None', 'All'], correctAnswer: 'Schedule function' },
                    { id: 6, text: 'What is a queue trigger?', options: ['Queue message', 'Queue length', 'None', 'All'], correctAnswer: 'Queue message' },
                    { id: 7, text: 'What is a blob trigger?', options: ['Blob event', 'Blob data', 'None', 'All'], correctAnswer: 'Blob event' },
                    { id: 8, text: 'What is a durable function?', options: ['Orchestration', 'Function', 'None', 'All'], correctAnswer: 'Orchestration' },
                    { id: 9, text: 'What is a function output binding?', options: ['Send data', 'Receive data', 'None', 'All'], correctAnswer: 'Send data' },
                    { id: 10, text: 'What is a function input binding?', options: ['Receive data', 'Send data', 'None', 'All'], correctAnswer: 'Receive data' }
                ],
                medium: [
                    { id: 11, text: 'What is a function app slot?', options: ['Deployment slot', 'Database slot', 'None', 'All'], correctAnswer: 'Deployment slot' },
                    { id: 12, text: 'What is a function app key?', options: ['Access key', 'Secret key', 'None', 'All'], correctAnswer: 'Access key' },
                    { id: 13, text: 'What is a function app setting?', options: ['Configuration', 'Database', 'None', 'All'], correctAnswer: 'Configuration' },
                    { id: 14, text: 'What is a function app identity?', options: ['Managed identity', 'User identity', 'None', 'All'], correctAnswer: 'Managed identity' },
                    { id: 15, text: 'What is a function app scale?', options: ['Auto scale', 'Manual scale', 'None', 'All'], correctAnswer: 'Auto scale' },
                    { id: 16, text: 'What is a function app log?', options: ['Log output', 'Log input', 'None', 'All'], correctAnswer: 'Log output' },
                    { id: 17, text: 'What is a function app deployment?', options: ['Deploy code', 'Deploy data', 'None', 'All'], correctAnswer: 'Deploy code' },
                    { id: 18, text: 'What is a function app proxy?', options: ['API gateway', 'API client', 'None', 'All'], correctAnswer: 'API gateway' },
                    { id: 19, text: 'What is a function app integration?', options: ['Connect services', 'Connect data', 'None', 'All'], correctAnswer: 'Connect services' },
                    { id: 20, text: 'What is a function app monitoring?', options: ['Monitor app', 'Monitor data', 'None', 'All'], correctAnswer: 'Monitor app' }
                ],
                high: [
                    { id: 21, text: 'What is a function chaining?', options: ['Sequence of functions', 'Single function', 'None', 'All'], correctAnswer: 'Sequence of functions' },
                    { id: 22, text: 'What is a fan-out/fan-in pattern?', options: ['Parallel execution', 'Serial execution', 'None', 'All'], correctAnswer: 'Parallel execution' },
                    { id: 23, text: 'What is a function retry policy?', options: ['Retry on failure', 'Retry on success', 'None', 'All'], correctAnswer: 'Retry on failure' },
                    { id: 24, text: 'What is a function app slot swap?', options: ['Swap slots', 'Swap data', 'None', 'All'], correctAnswer: 'Swap slots' },
                    { id: 25, text: 'What is a function app backup?', options: ['Backup app', 'Backup data', 'None', 'All'], correctAnswer: 'Backup app' },
                    { id: 26, text: 'What is a function app restore?', options: ['Restore app', 'Restore data', 'None', 'All'], correctAnswer: 'Restore app' },
                    { id: 27, text: 'What is a function app staging?', options: ['Staging environment', 'Production environment', 'None', 'All'], correctAnswer: 'Staging environment' },
                    { id: 28, text: 'What is a function app production?', options: ['Production environment', 'Staging environment', 'None', 'All'], correctAnswer: 'Production environment' },
                    { id: 29, text: 'What is a function app slot setting?', options: ['Slot config', 'App config', 'None', 'All'], correctAnswer: 'Slot config' },
                    { id: 30, text: 'What is a function app scale controller?', options: ['Scale manager', 'Scale agent', 'None', 'All'], correctAnswer: 'Scale manager' }
                ]
            },
            "service bus": {
                low: [
                    { id: 1, text: 'What is Azure Service Bus?', options: ['Messaging service', 'Database', 'IDE', 'None'], correctAnswer: 'Messaging service' },
                    { id: 2, text: 'What is a queue in Service Bus?', options: ['Message queue', 'Data queue', 'None', 'All'], correctAnswer: 'Message queue' },
                    { id: 3, text: 'What is a topic in Service Bus?', options: ['Publish/subscribe', 'Queue', 'None', 'All'], correctAnswer: 'Publish/subscribe' },
                    { id: 4, text: 'What is a subscription in Service Bus?', options: ['Receive messages', 'Send messages', 'None', 'All'], correctAnswer: 'Receive messages' },
                    { id: 5, text: 'What is a dead-letter queue?', options: ['Failed messages', 'Successful messages', 'None', 'All'], correctAnswer: 'Failed messages' },
                    { id: 6, text: 'What is a message session?', options: ['Session state', 'Session data', 'None', 'All'], correctAnswer: 'Session state' },
                    { id: 7, text: 'What is a message lock?', options: ['Lock message', 'Unlock message', 'None', 'All'], correctAnswer: 'Lock message' },
                    { id: 8, text: 'What is a message TTL?', options: ['Time to live', 'Time to leave', 'None', 'All'], correctAnswer: 'Time to live' },
                    { id: 9, text: 'What is a message batch?', options: ['Group of messages', 'Single message', 'None', 'All'], correctAnswer: 'Group of messages' },
                    { id: 10, text: 'What is a message property?', options: ['Metadata', 'Data', 'None', 'All'], correctAnswer: 'Metadata' }
                ],
                medium: [
                    { id: 11, text: 'What is a Service Bus namespace?', options: ['Container for queues', 'Container for data', 'None', 'All'], correctAnswer: 'Container for queues' },
                    { id: 12, text: 'What is a Service Bus relay?', options: ['Hybrid connection', 'Direct connection', 'None', 'All'], correctAnswer: 'Hybrid connection' },
                    { id: 13, text: 'What is a Service Bus partition?', options: ['Partitioned queue', 'Partitioned data', 'None', 'All'], correctAnswer: 'Partitioned queue' },
                    { id: 14, text: 'What is a Service Bus session?', options: ['Session state', 'Session data', 'None', 'All'], correctAnswer: 'Session state' },
                    { id: 15, text: 'What is a Service Bus rule?', options: ['Filter messages', 'Filter data', 'None', 'All'], correctAnswer: 'Filter messages' },
                    { id: 16, text: 'What is a Service Bus filter?', options: ['Message filter', 'Data filter', 'None', 'All'], correctAnswer: 'Message filter' },
                    { id: 17, text: 'What is a Service Bus action?', options: ['Message action', 'Data action', 'None', 'All'], correctAnswer: 'Message action' },
                    { id: 18, text: 'What is a Service Bus forwardTo?', options: ['Forward message', 'Forward data', 'None', 'All'], correctAnswer: 'Forward message' },
                    { id: 19, text: 'What is a Service Bus auto-delete?', options: ['Auto delete queue', 'Auto delete data', 'None', 'All'], correctAnswer: 'Auto delete queue' },
                    { id: 20, text: 'What is a Service Bus duplicate detection?', options: ['Detect duplicates', 'Detect errors', 'None', 'All'], correctAnswer: 'Detect duplicates' }
                ],
                high: [
                    { id: 21, text: 'What is a Service Bus geo-disaster recovery?', options: ['DR', 'Backup', 'None', 'All'], correctAnswer: 'DR' },
                    { id: 22, text: 'What is a Service Bus premium tier?', options: ['Premium features', 'Basic features', 'None', 'All'], correctAnswer: 'Premium features' },
                    { id: 23, text: 'What is a Service Bus encryption?', options: ['Encrypt messages', 'Encrypt data', 'None', 'All'], correctAnswer: 'Encrypt messages' },
                    { id: 24, text: 'What is a Service Bus managed identity?', options: ['Identity for access', 'Identity for data', 'None', 'All'], correctAnswer: 'Identity for access' },
                    { id: 25, text: 'What is a Service Bus virtual network?', options: ['Private network', 'Public network', 'None', 'All'], correctAnswer: 'Private network' },
                    { id: 26, text: 'What is a Service Bus firewall?', options: ['Security', 'Performance', 'None', 'All'], correctAnswer: 'Security' },
                    { id: 27, text: 'What is a Service Bus diagnostic log?', options: ['Log messages', 'Log data', 'None', 'All'], correctAnswer: 'Log messages' },
                    { id: 28, text: 'What is a Service Bus metric?', options: ['Monitor queue', 'Monitor data', 'None', 'All'], correctAnswer: 'Monitor queue' },
                    { id: 29, text: 'What is a Service Bus alert?', options: ['Alert on event', 'Alert on data', 'None', 'All'], correctAnswer: 'Alert on event' },
                    { id: 30, text: 'What is a Service Bus dead-letter reason?', options: ['Reason for failure', 'Reason for success', 'None', 'All'], correctAnswer: 'Reason for failure' }
                ]
            },
            "event grid": {
                low: [
                    { id: 1, text: 'What is Azure Event Grid?', options: ['Event routing', 'Database', 'IDE', 'None'], correctAnswer: 'Event routing' },
                    { id: 2, text: 'What is an event in Event Grid?', options: ['Notification', 'Data', 'None', 'All'], correctAnswer: 'Notification' },
                    { id: 3, text: 'What is a topic in Event Grid?', options: ['Event publisher', 'Event subscriber', 'None', 'All'], correctAnswer: 'Event publisher' },
                    { id: 4, text: 'What is a subscription in Event Grid?', options: ['Event subscriber', 'Event publisher', 'None', 'All'], correctAnswer: 'Event subscriber' },
                    { id: 5, text: 'What is an event handler?', options: ['Process event', 'Send event', 'None', 'All'], correctAnswer: 'Process event' },
                    { id: 6, text: 'What is an event source?', options: ['Origin of event', 'Destination of event', 'None', 'All'], correctAnswer: 'Origin of event' },
                    { id: 7, text: 'What is an event type?', options: ['Type of event', 'Type of data', 'None', 'All'], correctAnswer: 'Type of event' },
                    { id: 8, text: 'What is an event schema?', options: ['Event structure', 'Event data', 'None', 'All'], correctAnswer: 'Event structure' },
                    { id: 9, text: 'What is an event delivery?', options: ['Send event', 'Receive event', 'None', 'All'], correctAnswer: 'Send event' },
                    { id: 10, text: 'What is an event subscription filter?', options: ['Filter events', 'Filter data', 'None', 'All'], correctAnswer: 'Filter events' }
                ],
                medium: [
                    { id: 11, text: 'What is a custom topic?', options: ['User-defined topic', 'System topic', 'None', 'All'], correctAnswer: 'User-defined topic' },
                    { id: 12, text: 'What is a system topic?', options: ['Azure-defined topic', 'User-defined topic', 'None', 'All'], correctAnswer: 'Azure-defined topic' },
                    { id: 13, text: 'What is event schema validation?', options: ['Validate event', 'Validate data', 'None', 'All'], correctAnswer: 'Validate event' },
                    { id: 14, text: 'What is event retry policy?', options: ['Retry on failure', 'Retry on success', 'None', 'All'], correctAnswer: 'Retry on failure' },
                    { id: 15, text: 'What is event dead-lettering?', options: ['Handle failed events', 'Handle successful events', 'None', 'All'], correctAnswer: 'Handle failed events' },
                    { id: 16, text: 'What is event delivery attempt?', options: ['Number of tries', 'Number of successes', 'None', 'All'], correctAnswer: 'Number of tries' },
                    { id: 17, text: 'What is event advanced filtering?', options: ['Complex filter', 'Simple filter', 'None', 'All'], correctAnswer: 'Complex filter' },
                    { id: 18, text: 'What is event grid partner topic?', options: ['Partner integration', 'User integration', 'None', 'All'], correctAnswer: 'Partner integration' },
                    { id: 19, text: 'What is event grid domain?', options: ['Event management', 'Data management', 'None', 'All'], correctAnswer: 'Event management' },
                    { id: 20, text: 'What is event grid event handler?', options: ['Process event', 'Send event', 'None', 'All'], correctAnswer: 'Process event' }
                ],
                high: [
                    { id: 21, text: 'What is event grid security?', options: ['Secure events', 'Secure data', 'None', 'All'], correctAnswer: 'Secure events' },
                    { id: 22, text: 'What is event grid managed identity?', options: ['Identity for access', 'Identity for data', 'None', 'All'], correctAnswer: 'Identity for access' },
                    { id: 23, text: 'What is event grid delivery status?', options: ['Status of delivery', 'Status of receipt', 'None', 'All'], correctAnswer: 'Status of delivery' },
                    { id: 24, text: 'What is event grid event time?', options: ['Time of event', 'Time of data', 'None', 'All'], correctAnswer: 'Time of event' },
                    { id: 25, text: 'What is event grid event id?', options: ['Unique event id', 'Unique data id', 'None', 'All'], correctAnswer: 'Unique event id' },
                    { id: 26, text: 'What is event grid event type?', options: ['Type of event', 'Type of data', 'None', 'All'], correctAnswer: 'Type of event' },
                    { id: 27, text: 'What is event grid event subject?', options: ['Event subject', 'Data subject', 'None', 'All'], correctAnswer: 'Event subject' },
                    { id: 28, text: 'What is event grid event data?', options: ['Event data', 'Event subject', 'None', 'All'], correctAnswer: 'Event data' },
                    { id: 29, text: 'What is event grid event subscription?', options: ['Subscribe to event', 'Subscribe to data', 'None', 'All'], correctAnswer: 'Subscribe to event' },
                    { id: 30, text: 'What is event grid event publisher?', options: ['Publish event', 'Publish data', 'None', 'All'], correctAnswer: 'Publish event' }
                ]
            },
            "databricks": {
                low: [
                    { id: 1, text: 'What is Azure Databricks?', options: ['Analytics platform', 'Database', 'IDE', 'None'], correctAnswer: 'Analytics platform' },
                    { id: 2, text: 'What is a Databricks cluster?', options: ['Compute resource', 'Storage resource', 'None', 'All'], correctAnswer: 'Compute resource' },
                    { id: 3, text: 'What is a Databricks notebook?', options: ['Interactive document', 'Static document', 'None', 'All'], correctAnswer: 'Interactive document' },
                    { id: 4, text: 'What is a Databricks job?', options: ['Automated task', 'Manual task', 'None', 'All'], correctAnswer: 'Automated task' },
                    { id: 5, text: 'What is a Databricks workspace?', options: ['User environment', 'User data', 'None', 'All'], correctAnswer: 'User environment' },
                    { id: 6, text: 'What is a Databricks DBFS?', options: ['File system', 'Database', 'None', 'All'], correctAnswer: 'File system' },
                    { id: 7, text: 'What is a Databricks library?', options: ['Package', 'Database', 'None', 'All'], correctAnswer: 'Package' },
                    { id: 8, text: 'What is a Databricks cluster mode?', options: ['Cluster config', 'Cluster data', 'None', 'All'], correctAnswer: 'Cluster config' },
                    { id: 9, text: 'What is a Databricks secret scope?', options: ['Secret storage', 'Secret data', 'None', 'All'], correctAnswer: 'Secret storage' },
                    { id: 10, text: 'What is a Databricks token?', options: ['Access token', 'Access code', 'None', 'All'], correctAnswer: 'Access token' }
                ],
                medium: [
                    { id: 11, text: 'What is a Databricks cluster pool?', options: ['Pool of clusters', 'Pool of data', 'None', 'All'], correctAnswer: 'Pool of clusters' },
                    { id: 12, text: 'What is a Databricks job cluster?', options: ['Cluster for job', 'Cluster for data', 'None', 'All'], correctAnswer: 'Cluster for job' },
                    { id: 13, text: 'What is a Databricks workspace user?', options: ['User in workspace', 'User in data', 'None', 'All'], correctAnswer: 'User in workspace' },
                    { id: 14, text: 'What is a Databricks workspace admin?', options: ['Admin in workspace', 'Admin in data', 'None', 'All'], correctAnswer: 'Admin in workspace' },
                    { id: 15, text: 'What is a Databricks notebook cell?', options: ['Cell in notebook', 'Cell in data', 'None', 'All'], correctAnswer: 'Cell in notebook' },
                    { id: 16, text: 'What is a Databricks notebook output?', options: ['Output of cell', 'Output of data', 'None', 'All'], correctAnswer: 'Output of cell' },
                    { id: 17, text: 'What is a Databricks notebook language?', options: ['Language in notebook', 'Language in data', 'None', 'All'], correctAnswer: 'Language in notebook' },
                    { id: 18, text: 'What is a Databricks notebook revision?', options: ['Version of notebook', 'Version of data', 'None', 'All'], correctAnswer: 'Version of notebook' },
                    { id: 19, text: 'What is a Databricks notebook run?', options: ['Run notebook', 'Run data', 'None', 'All'], correctAnswer: 'Run notebook' },
                    { id: 20, text: 'What is a Databricks notebook schedule?', options: ['Schedule run', 'Schedule data', 'None', 'All'], correctAnswer: 'Schedule run' }
                ],
                high: [
                    { id: 21, text: 'What is a Databricks workspace API?', options: ['API for workspace', 'API for data', 'None', 'All'], correctAnswer: 'API for workspace' },
                    { id: 22, text: 'What is a Databricks REST API?', options: ['API for Databricks', 'API for Azure', 'None', 'All'], correctAnswer: 'API for Databricks' },
                    { id: 23, text: 'What is a Databricks CLI?', options: ['Command line tool', 'Command line interface', 'None', 'All'], correctAnswer: 'Command line tool' },
                    { id: 24, text: 'What is a Databricks cluster event?', options: ['Cluster event', 'Data event', 'None', 'All'], correctAnswer: 'Cluster event' },
                    { id: 25, text: 'What is a Databricks cluster log?', options: ['Log of cluster', 'Log of data', 'None', 'All'], correctAnswer: 'Log of cluster' },
                    { id: 26, text: 'What is a Databricks notebook export?', options: ['Export notebook', 'Export data', 'None', 'All'], correctAnswer: 'Export notebook' },
                    { id: 27, text: 'What is a Databricks notebook import?', options: ['Import notebook', 'Import data', 'None', 'All'], correctAnswer: 'Import notebook' },
                    { id: 28, text: 'What is a Databricks notebook permission?', options: ['Permission for notebook', 'Permission for data', 'None', 'All'], correctAnswer: 'Permission for notebook' },
                    { id: 29, text: 'What is a Databricks workspace permission?', options: ['Permission for workspace', 'Permission for data', 'None', 'All'], correctAnswer: 'Permission for workspace' },
                    { id: 30, text: 'What is a Databricks workspace secret?', options: ['Secret in workspace', 'Secret in data', 'None', 'All'], correctAnswer: 'Secret in workspace' }
                ]
            },
            "datafactory": {
                low: [
                    { id: 1, text: 'What is Azure Data Factory?', options: ['Data integration', 'Database', 'IDE', 'None'], correctAnswer: 'Data integration' },
                    { id: 2, text: 'What is a pipeline in Data Factory?', options: ['Workflow', 'Dataflow', 'None', 'All'], correctAnswer: 'Workflow' },
                    { id: 3, text: 'What is a dataset in Data Factory?', options: ['Data structure', 'Data type', 'None', 'All'], correctAnswer: 'Data structure' },
                    { id: 4, text: 'What is a linked service?', options: ['Connection', 'Data', 'None', 'All'], correctAnswer: 'Connection' },
                    { id: 5, text: 'What is a trigger in Data Factory?', options: ['Start pipeline', 'End pipeline', 'None', 'All'], correctAnswer: 'Start pipeline' },
                    { id: 6, text: 'What is a dataflow?', options: ['Data transformation', 'Data movement', 'None', 'All'], correctAnswer: 'Data transformation' },
                    { id: 7, text: 'What is a mapping dataflow?', options: ['Transform data', 'Move data', 'None', 'All'], correctAnswer: 'Transform data' },
                    { id: 8, text: 'What is a wrangling dataflow?', options: ['Data preparation', 'Data analysis', 'None', 'All'], correctAnswer: 'Data preparation' },
                    { id: 9, text: 'What is a control activity?', options: ['Control flow', 'Data flow', 'None', 'All'], correctAnswer: 'Control flow' },
                    { id: 10, text: 'What is a copy activity?', options: ['Copy data', 'Move data', 'None', 'All'], correctAnswer: 'Copy data' }
                ],
                medium: [
                    { id: 11, text: 'What is a pipeline parameter?', options: ['Input value', 'Output value', 'None', 'All'], correctAnswer: 'Input value' },
                    { id: 12, text: 'What is a pipeline variable?', options: ['Store value', 'Store data', 'None', 'All'], correctAnswer: 'Store value' },
                    { id: 13, text: 'What is a pipeline expression?', options: ['Expression in pipeline', 'Expression in data', 'None', 'All'], correctAnswer: 'Expression in pipeline' },
                    { id: 14, text: 'What is a pipeline activity?', options: ['Task in pipeline', 'Task in data', 'None', 'All'], correctAnswer: 'Task in pipeline' },
                    { id: 15, text: 'What is a pipeline dependency?', options: ['Dependency between activities', 'Dependency between data', 'None', 'All'], correctAnswer: 'Dependency between activities' },
                    { id: 16, text: 'What is a pipeline concurrency?', options: ['Parallel execution', 'Serial execution', 'None', 'All'], correctAnswer: 'Parallel execution' },
                    { id: 17, text: 'What is a pipeline timeout?', options: ['Time limit', 'Data limit', 'None', 'All'], correctAnswer: 'Time limit' },
                    { id: 18, text: 'What is a pipeline retry?', options: ['Retry on failure', 'Retry on success', 'None', 'All'], correctAnswer: 'Retry on failure' },
                    { id: 19, text: 'What is a pipeline run?', options: ['Execution of pipeline', 'Design of pipeline', 'None', 'All'], correctAnswer: 'Execution of pipeline' },
                    { id: 20, text: 'What is a pipeline trigger?', options: ['Start pipeline', 'End pipeline', 'None', 'All'], correctAnswer: 'Start pipeline' }
                ],
                high: [
                    { id: 21, text: 'What is a data factory integration runtime?', options: ['Compute infrastructure', 'Data infrastructure', 'None', 'All'], correctAnswer: 'Compute infrastructure' },
                    { id: 22, text: 'What is a data factory managed VNET?', options: ['Virtual network', 'Physical network', 'None', 'All'], correctAnswer: 'Virtual network' },
                    { id: 23, text: 'What is a data factory self-hosted IR?', options: ['Self-hosted integration runtime', 'Cloud-hosted integration runtime', 'None', 'All'], correctAnswer: 'Self-hosted integration runtime' },
                    { id: 24, text: 'What is a data factory pipeline trigger?', options: ['Trigger pipeline', 'Trigger data', 'None', 'All'], correctAnswer: 'Trigger pipeline' },
                    { id: 25, text: 'What is a data factory pipeline monitoring?', options: ['Monitor pipeline', 'Monitor data', 'None', 'All'], correctAnswer: 'Monitor pipeline' },
                    { id: 26, text: 'What is a data factory pipeline alert?', options: ['Alert on pipeline', 'Alert on data', 'None', 'All'], correctAnswer: 'Alert on pipeline' },
                    { id: 27, text: 'What is a data factory pipeline parameterization?', options: ['Parameterize pipeline', 'Parameterize data', 'None', 'All'], correctAnswer: 'Parameterize pipeline' },
                    { id: 28, text: 'What is a data factory pipeline scheduling?', options: ['Schedule pipeline', 'Schedule data', 'None', 'All'], correctAnswer: 'Schedule pipeline' },
                    { id: 29, text: 'What is a data factory pipeline dependency?', options: ['Dependency between pipelines', 'Dependency between data', 'None', 'All'], correctAnswer: 'Dependency between pipelines' },
                    { id: 30, text: 'What is a data factory pipeline concurrency?', options: ['Parallel execution', 'Serial execution', 'None', 'All'], correctAnswer: 'Parallel execution' }
                ]
            }
        };
        const skill = criteria.techStack;
        const level = (criteria.skillLevel || '').toLowerCase();
        if (db[skill] && db[skill][level]) {
            return db[skill][level];
        }
        // fallback: return empty array
        return [];
    }
}


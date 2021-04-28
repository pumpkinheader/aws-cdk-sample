import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ecr from "@aws-cdk/aws-ecr"
import * as iam from "@aws-cdk/aws-iam"
import { ManagedPolicy, Policy } from '@aws-cdk/aws-iam';

export class EcsSampleStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const repository = ecr.Repository.fromRepositoryName(this, 'devSandboxEcstestRepo', 'dev-sandbox-ecstest-repo')

        const ecscodedeployrole = new iam.Role(this, "ecs-test-codedeploy-role", {
            assumedBy: new iam.ServicePrincipal("codedeploy.amazonaws.com")
        }).addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AWSCodeDeployRoleForECS"))

        const vpc = new ec2.Vpc(this, "dev-sandbox-ecstest-vpc", {
            cidr: "10.1.0.0/16",
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: ec2.SubnetType.PRIVATE,
                },
            ]
        })
        const cluster = new ecs.Cluster(this, "CdkTestCluster", {
            vpc: vpc,
            clusterName: 'DevSandboxSampleCluster',
        });
        const taskDefinition = new ecs.FargateTaskDefinition(this, 'DevSandboxSampleTaskDefinition');
        const container = taskDefinition.addContainer('DevSandboxSampleWebContainer', {
            image: ecs.ContainerImage.fromEcrRepository(repository),
        });
        container.addPortMappings({
            containerPort: 80
        });

        // 何故か３０分たっても終わらない。。要検証。リポジトリにimageがなくて待ってるかも。最大１時間待つはず。
        const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'DevSandboxSampleService', {
            cluster: cluster,
            cpu: 256,
            memoryLimitMiB: 512,
            desiredCount: 1,
            // やるならACMで証明書が必要だよ。targetProtocol: ApplicationProtocol.HTTPS,
            taskDefinition: taskDefinition
        });
    }
}
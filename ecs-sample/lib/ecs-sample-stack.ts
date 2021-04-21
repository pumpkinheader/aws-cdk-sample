import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { ApplicationProtocol, ApplicationProtocolVersion } from '@aws-cdk/aws-elasticloadbalancingv2';

export class EcsSampleStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
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
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        });
        container.addPortMappings({
            containerPort: 80
        });

        const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'DevSandboxSampleService', {
            cluster: cluster,
            cpu: 512,
            memoryLimitMiB: 1024,
            desiredCount: 1,
            // やるならACMで証明書が必要だよ。targetProtocol: ApplicationProtocol.HTTPS,
            taskDefinition: taskDefinition
        });
    }
}
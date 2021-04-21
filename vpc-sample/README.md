# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


# VPC-Sample-Project
* 大体ＶＰＣは必要
* とりあえず最初に動かすやつ。なにか試すときはココでやってみる

## やりたいこと/やったことのメモ
[ ] Useful commands の使い方
[ ] 基本的なＶＰＣの作成
[ ] 基本的なリソース設定
    - Tag:Name をつける
    - CIDR設定
    - その他オプションの調査
    - Nat GatewayとRoute Table
[ ] 応用編
    - VPC IDの引き渡し（Ref）
        - Stackの分割について(export)
[ ] テストの導入
    - lint
    - snapshot
    - その他
[ ] CI/CD
    - PROD/STGなど環境ごとにアカウントやリソース名の付け替え
        - context

### Useful Commands の使い方
ようこそＣＤＫへ。状態。
    cdk init: 本projectの作成
    cdk bootstrap: CFn Templateの置き場所（S3）の作成
    cdk diff: terraform planみたいなやつ
    cdk synth: CFn templateを標準出力してくれる。testで使える
    cdk deploy: デプロイ(CFnのdeploy相当のはず)
参考文献：

### 基本的なＶＰＣの作成
オプションなしで適当なＶＰＣを作って壊してみる
    Name: {stack_name}/{vpc_name}/{subnet_name}
で各リソースが作成・関連付けされる
VPC, InternetGateway: vpc_nameまで
Subnet, Nat, RouteTable, EIP: subnet_nameまで

NAT2台は以外に高い（30日で1万ぐらい）のですぐ消すのじゃぞ
参考文献：ECSの料金プランのやつとか

### 基本的なリソースの設定
#### CIDR設定
- cidr: 'xx.xx.xx.xx/xx' で指定できる
- subnetCondtionで指定できるのはTypeごとのCIDR/NamePrefixだけ。AZ分 {NamePrefix}Subnet{AZ NUM} となる。

#### 困ったこと
- Nat作成時に VPCにinternetgatewayがないと怒られる
    - 初期値で作ったVPCのCIDRを変更したところ、VPCが変わるのでたいていのリソースが変わるがIGWだけ変更差分にでてこない。つらい。
- subnetを増やしすぎたので、減らしてdeployしたところ、CIDRかぶってると怒られた。
    - 消し残りがあるのか、先にcreateが先行してしまっているのかは不明

### 応用編
### テストの導入
### CI/CD
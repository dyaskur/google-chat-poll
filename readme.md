# Google Chat Poll Bot
#### An interactive poll app for google chat with Node.js (originally from [Google codelabs](https://codelabs.developers.google.com/codelabs/google-chat-poll-bot))

[![StyleCI](https://github.styleci.io/repos/600267700/shield?branch=master)](https://styleci.io/repos/600267700)
[![Github Action](https://github.com/dyaskur/google-chat-poll/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/dyaskur/google-chat-poll/actions) 
[![Scrutinizer Quality Score](https://scrutinizer-ci.com/g/dyaskur/google-chat-poll/badges/quality-score.png?s=4023c984fc1163a44f4220cd7d57406643ced9f2)](https://scrutinizer-ci.com/g/dyaskur/google-chat-poll/)
[![Coverage Status](https://coveralls.io/repos/github/dyaskur/google-chat-poll/badge.svg?branch=master)](https://coveralls.io/github/dyaskur/google-chat-poll)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)

This is just a bunch of code that I use to learn more about serverless and also google chat apps using note JS.

Original Feature:
- Create poll
- Record vote
- Doesn't using any database. (Vote records are saved in chat message)

What I updated are:

- Upgrade Card v1 to Card v2
- Unit Test (ready to TDD)
- Save voter names
- Anonymous vote
- Add more option after poll is created

Todo:

 - Close the poll
 - Max vote(expired) time
 - Multiple choice vote(1 user can vote on more than 1 choice)
 - Save state to database
 - Other features (suggest me please...)
 - Deno or Cloudflare worker support (hopefully can)
 - Migrate to ES6 implementation
 - Migrate to Typescript
 - Migrate to Golang (will create another repo)


Limitation:
- Since the data state is saved in chat message at yet, there is maximum that can be save (I am still finding out the limit) my SO question : https://stackoverflow.com/questions/75478309/what-is-the-limit-of-google-chat-message-card-via-chatbot
- Currently, only tested and worked using GCP cloud function, I will test later using Azure function, AWS lambda, Tencent OCF, and other FaaS/serverless service

Tips: You can test the json file on **tests/json** folder to https://gw-card-builder.web.app/ to view the output of the application.

<sub>
Again, this code just my learning code. That's why I don't directly migrate to TypeScript or Golang in early stage. 
I just want to learning nodejs and google chat apps.
Feel free if you have suggestion or advice for this apps and codes.
</sub>

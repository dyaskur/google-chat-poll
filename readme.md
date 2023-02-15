# Google Chat Poll Bot
#### An interactive poll app for google chat with Node.js (originally from [Google codelabs](https://codelabs.developers.google.com/codelabs/google-chat-poll-bot))


This is just a bunch of code that I use to learn more about serverless and also google chat apps using note JS.

Original Feature:
- Create poll
- Record vote
- Doesn't using any database. (Vote records are saved in chat message)

What I updated are:

- Upgrade Card v1 to Card v2
- Unit Test (ready to TDD)
- Save voter names

Todo:

 - Use Linter (ESLint)
 - Anonymous vote
 - Close the poll
 - Max vote(expired) time
 - Multiple choice vote(1 user can vote on more than 1 choice)
 - Other features (suggest me please...)
 - Deno or Cloudflare worker support (hopefully can)
 - Migrate to ES6 implementation
 - Migrate to Typescript
 - Migrate to Golang (will create another repo)

<sub>
Again, this code just my learning code. That's why I don't directly migrate to TypeScript or Golang in early stage. 
I want to start learning nodejs again after I haven't had a project like this in a long time.
Feel free if you have suggestion or advice for this apps and codes.
</sub>

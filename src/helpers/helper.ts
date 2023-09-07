function getRandomString(string: Array<string>) {
  return string[Math.floor(Math.random() * string.length)];
}

function getRandomFooter() {
  const footers = [
    'We trust that you\'ll discover our service valuable, and we encourage you to reach out to us without hesitation should you have any inquiries or apprehensions.',
    'We hope you find our service useful and please don\'t hesitate to contact us if you have any questions or concerns.',
    'We trust that our service proves valuable to you. Should you have any inquiries or apprehensions, please feel free to reach out to us without hesitation.',
    'We anticipate that you\'ll find our service valuable, and please don\'t hesitate to get in touch if you have any questions or concerns.',
    'We appreciate your usage of our application and please don\'t hesitate to contact us if you have any questions or concerns.',
    'Thank you for using our app. We hope you\'ll find it to be a valuable tool',
  ];
  return getRandomString(footers);
}

function getRandomGreet() {
  const greets = [
    'Hi there! ',
    'Greetings! ',
    'Hello, ',
    'Hi, ',
    'Yay! ',
  ];
  return getRandomString(greets);
}

function getRandomDescription() {
  const descriptions = [
    'I\'m here to assist you in creating polls that can improve teamwork and streamline the process of making decisions.',
    'I can help you create polls to enhance collaboration and efficiency in decision-making using Google Chat™.',
    'I can help you make polls for better teamwork using Google Chat™',
    'I\'m capable of assisting you in generating polls that can boost collaboration and streamline decision-making through Google Chat™.',
    'My purpose is to support you in crafting polls that enhance teamwork and simplify the decision-making process.',
    '',
  ];
  return getRandomString(descriptions);
}

function getRandomExample() {
  const examples = [
    '"Which is the best country to visit" "Indonesia" "Bali"',
    '"When should we schedule our team days?" "Monday" "Tuesday" "Wednesday"',
    '"What would be the ideal date for our vacation?" "30 th February" "26 th March" "15 th April"',
    '"Which date works best for [event]?" "30 th February" "26 th March" "15 th April"',
    '"Your Question" "Answer 1" "Answer 2"',
  ];
  return getRandomString(examples);
}

function getRandomInfo() {
  const info = [
    'This app is designed to be used within group or space rooms with multiple members. However, if you\'d like to learn more about it, you can test it in a direct message (DM) conversation here.',
    'This app is a collaborative tool and is intended to be used in group or space rooms with multiple members. However, you can also test it out in a direct message (DM) here to discover more about its features.',
    'As a collaborative application, this is intended for use in group or space rooms with multiple members. However, you can also explore and test it further in a direct message (DM) here to gain a better understanding.',
    'This app is meant for group/space collaboration, but you can also test it via DM for more insights',
    'This is a collaborative app designed for group or space rooms, but you can also test it via DM for a better grasp.',
    'To enhance its functionality, install this app in a group or space room with multiple members. However, you can also test it in a direct message (DM) here to learn more.',
  ];
  return getRandomString(info);
}

export function generateHelpText(isPrivate: boolean = false) {
  const greet = getRandomGreet();
  const description = getRandomDescription();
  const footer = getRandomFooter();
  const example = getRandomExample();
  const example2 = getRandomExample();
  let additionalMessage = '';
  if (isPrivate) {
    additionalMessage = getRandomInfo() + '\n\n';
  }
  return greet + description + '\n' +
    '\n' + additionalMessage +
    'Below is an example commands:\n' +
    '`/poll` - You will need to fill out the topic and answers in the form that will be displayed.\n' +
    '`/poll ' + example + '` - to create a poll with autofill \n' +
    '\n' +
    'Alternatively, you can create poll by mentioning me with question and answers. ' +
    'e.g *@Absolute Poll ' + example2 + '*\n\n' +
    footer;
}

export function generateHelperWidget() {
  return {
    'widgets': [
      {
        'divider': {},
      },
      {
        'divider': {},
      },
      {
        'divider': {},
      },
      {
        'divider': {},
      },
      {
        'textParagraph': {
          'text': 'If you have any problems, questions, or feedback, ' +
            'please feel free to post them <a href="https://github.com/dyaskur/google-chat-poll/issues">here</a> ',
        },
      }],
  };
}

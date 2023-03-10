import * as botService from './../services/bot.service.js';
import httpStatus from 'http-status';

export const processMsg = async (req, res) => {
  const telegramId = req.body.message.chat.id;
  const { text: msg, message_id: messageId } = req.body.message;
  const { userInfo } = req;
  try {
    await botService.processMsg(telegramId, messageId, msg, userInfo);
    res.sendStatus(httpStatus.OK);
  } catch (e) {
    switch (e.message) {
      case 'COMMAND_DOES_NOT_EXIST':
        await botService.sendMessage(
          telegramId,
          `The ${msg} command does not exist.`
        );
        break;
      case 'ATTEMPT_TO_EDIT_MSG':
        await botService.sendMessage(
          req.body.edited_message.chat.id,
          'Responses are not provided on edited messages.'
        );
        break;
      case 'OPENAI_SERVICE_DOWN':
        await botService.sendMessage(
          telegramId,
          'OpenAI API services temporarily down.'
        );
        break;
      case 'TELEGRAM_SERVICE_DOWN':
        await botService.sendMessage(
          telegramId,
          'Telegram Bot API services temporarily down.'
        );
        break;
      case 'DESCRIPTION_INSUFFICIENT':
        await botService.sendMessage(
          telegramId,
          'Please elaborate the image you want to generate.'
        );
        break;
      case 'EXCEEDED_IMG_GEN_LIMIT':
        await botService.sendMessage(
          telegramId,
          'At max ten images can be generated per query.'
        );
        break;
      case 'BOT_ALREADY_STARTED':
        await botService.sendMessage(
          telegramId,
          'Hephaestus is already running.'
        );
        break;
      case 'EXHAUSTED_BASIC_TIER_IMAGE_QUOTA':
        await botService.sendMessage(
          telegramId,
          'You have a basic account which allows 5 image generations a day. You have exhausted your daily quota for image generation. Daily quota for image generation will be replenished at 12 in the night.\nUpgrade to premium for free by sending /upgrade command. It only takes 2 minutes!'
        );
        break;
      case 'EXCEEDED_BASIC_TIER_IMG_GEN_LIMIT':
        await botService.sendMessage(
          telegramId,
          'You have a basic account which allows 1 image generation per query. Upgrade to premium account for free to generate upto 10 images per query. Send /upgrade command to upgrade your account to premium. It only takes 2 minutes!'
        );
        break;
      case 'EXHAUSTED_BASIC_TIER_TEXT_QUOTA':
        await botService.sendMessage(
          telegramId,
          'You have a basic account while allows 15 text generations a day. You have exhausted your daily quota for text generation. Daily quota for basic accounts will be replenished at 12 in the night.\nUpgrade to premium for free by sending /upgrade command. It only takes 2 minutes!'
        );
        break;
      case 'EMPTY_TOKEN':
        await botService.sendMessage(
          telegramId,
          'I think you forgot to type the openai secret key. Please try again.'
        );
        break;
      case 'INVALID_TOKEN':
        await botService.sendMessage(
          telegramId,
          'Uh oh! The secret key you passed is invalid. Make sure you\'re passing the correct secret key.'
        );
        break;
      case 'ALREADY_BASIC_ACCOUNT':
        await botService.sendMessage(
          telegramId,
          'You are already using basic plan. If you want to upgrade to premium plan, send /switchtopremium command.'
        );
        break;
      case 'ALREADY_PREMIUM_ACCOUNT':
        await botService.sendMessage(
          telegramId,
          'You are already using premium plan. If you want to downgrade to basic plan, send /switchtobasic command.'
        );
        break;
      case 'UNABLE_TO_SWITCH_TO_PREMIUM':
        await botService.sendMessage(
          telegramId,
          'Uh oh! You cannot switch to premium plan just yet. Complete a one-time process of upgrading to premium. Send /howtoupgrade command to knows the steps to upgrading your account to premium plan.'
        );
        break;
      case 'INTERNAL_SERVER_ERROR':
      default:
        console.log(e);
        console.log(e.message);
        await botService.sendMessage(
          telegramId,
          'We have experienced unknown internal error. Hephaestus will shortly be back in service.'
        );
        break;
    }
    res.send(e.message);
  }
};

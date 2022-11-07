import type { Events, MessageCommandDeniedPayload } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import { TextLogger } from '../../lib/TextLogger';

export class UserEvent extends Listener<typeof Events.MessageCommandError> {
	public async run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		// Log command
		TextLogger.writeRegularError(content);

		return message.channel.send({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}

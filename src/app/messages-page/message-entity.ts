/**
 * Message entity as defined in backend repository
 *
 * message_id: id of the message
 * from_user_id: id of the sender
 * date: when message was sent as UNIX standard time in seconds
 * text: text contents of the message
 * raw_json: all json data as received from Telegram servers
 */
export interface IMessageEntity {
  message_id: string;
  from_user_id: string;
  date: string;
  text: string;
  raw_json: string;
}

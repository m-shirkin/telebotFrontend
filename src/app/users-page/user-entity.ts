/**
 * User entity as defined on the server
 *
 * user_id: unique id of the user, given by the Telegram upon registration
 * first_name
 * last_name
 * username: username like '@user123'
 * language_code: language code like 'ru'
 */
export interface IUserEntity {
  user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}

// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {UserService} from '../../../services/user.service';
import {UserProfile} from '../../../types';
import {BasicAuthenticationStrategyBindings} from '../keys';
import {BasicAuthenticationStrategyCredentials} from '../strategies/basic-strategy';
import {User} from '../users/user';
import {UserRepository} from '../users/user.repository';

export class BasicAuthenticationUserService
  implements UserService<User, BasicAuthenticationStrategyCredentials> {
  constructor(
    @inject(BasicAuthenticationStrategyBindings.USER_REPO)
    private userRepository: UserRepository,
  ) {}

  async verifyCredentials(
    credentials: BasicAuthenticationStrategyCredentials,
  ): Promise<User> {
    if (!credentials) {
      throw new HttpErrors.Unauthorized(`'credentials' is null`);
    } //if

    if (!credentials.email) {
      throw new HttpErrors.Unauthorized(`'credentials.email' is null`);
    } //if

    if (!credentials.password) {
      throw new HttpErrors.Unauthorized(`'credentials.password' is null`);
    } //if

    const foundUser = await this.userRepository.find(
      credentials.email,
      credentials.password,
    );
    if (!foundUser) {
      throw new HttpErrors['Unauthorized'](
        `User with email ${credentials.email} not found.`,
      );
    }

    if (credentials.password !== foundUser.password) {
      throw new HttpErrors.Unauthorized('The password is not correct.');
    } //if

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    if (!user) {
      throw new HttpErrors.Unauthorized(`'user' is null`);
    } //if

    if (!user.id) {
      throw new HttpErrors.Unauthorized(`'user.id' is null`);
    } //if

    if (!user.firstname) {
      throw new HttpErrors.Unauthorized(`'user.firstname' is null`);
    } //if

    if (!user.surname) {
      throw new HttpErrors.Unauthorized(`'user.surname' is null`);
    } //if

    if (!user.email) {
      throw new HttpErrors.Unauthorized(`'user.email' is null`);
    } //if

    let userProfile: UserProfile = {
      id: user.id,
      name: `${user.firstname} ${user.surname}`,
      email: user.email,
    };

    return userProfile;
  }
}
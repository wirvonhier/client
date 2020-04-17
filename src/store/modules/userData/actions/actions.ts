import { Actions } from 'vuex-smart-module';
import { Store } from 'vuex';
import { UserDataState, UserDataGetters, UserDataMutations } from '..';
import { RootState } from '@/store';
import { IUserData } from '../state/state.types';

export class UserDataActions extends Actions<UserDataState, UserDataGetters, UserDataMutations, UserDataActions> {
  // @ts-ignore
  private store!: Store<RootState>;

  $init(store: Store<RootState>): void {
    this.store = store;
  }

  setUserData(userData: Partial<IUserData>): void {
    this.commit('SET_USER_DATA', userData);
  }

  async loadUserAndSaveUserData(): Promise<void> {
    const userId = this.state.id;
    if (!userId) return;
    const user = await this.store.$http.get(`/users/${userId}`, true);
    this.setUserData(user);
  }
}

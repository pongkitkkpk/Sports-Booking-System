import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from '../slices/calendar';
import { reducer as projectsBoardReducer } from '../slices/projects_board';
import { reducer as mailboxReducer } from '../slices/mailbox';

const rootReducer = combineReducers({
  calendar: calendarReducer,
  projectsBoard: projectsBoardReducer,
  mailbox: mailboxReducer
});

export default rootReducer;

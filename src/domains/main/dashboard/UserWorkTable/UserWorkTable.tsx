import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ClearIcon from '@material-ui/icons/Clear';
import StopIcon from '@material-ui/icons/StopRounded';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Table } from 'src/domains/@common/Table';
import { DownloadList } from 'src/store/@common/entities';
import { UserWork } from 'src/store/tasks';
import { TimerCell } from '../TimerCell';
import { DurationField } from './DurationField';

export interface IUserWorkTableProps extends RouteComponentProps<{}> {
  userWorks: DownloadList<UserWork>;
  classes: any;
  currentUserWorkId?: number;
  deleteUserWork: any;
  projectId: number;
  stopUserWork: any;
  taskId: number;
}

export class UserWorkTableJsx extends React.PureComponent<IUserWorkTableProps> {
  public render() {
    const { userWorks } = this.props;
    if (!userWorks || !userWorks.length) {
      return null;
    }
    return <Table items={userWorks} renderItem={this.renderItem} perPage={3} />;
  }

  private renderItem = ({ id, description, startAt, finishAt, duration }: UserWork) => {
    const { classes, currentUserWorkId, projectId, taskId } = this.props;
    return (
      <TableRow className={classes.row} key={id} hover>
        <TableCell>{description}</TableCell>
        <TableCell>{startAt && startAt.format('YYYY-MM-DD')}</TableCell>
        <TableCell>{finishAt && finishAt.format('YYYY-MM-DD')}</TableCell>
        {currentUserWorkId === id ? (
          <TimerCell />
        ) : (
          <TableCell numeric>
            <DurationField projectId={projectId} taskId={taskId} value={duration} userWorkId={id} />
          </TableCell>
        )}
        <TableCell numeric>
          {currentUserWorkId === id ? (
            <IconButton onClick={this.stopUserWork(id)} className={classes.stop}>
              <StopIcon />
            </IconButton>
          ) : (
            <IconButton onClick={this.deleteUserWork(id)}>
              <ClearIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    );
  };

  private deleteUserWork = (userWorkId: number | string | undefined) => () => {
    if (typeof userWorkId === 'number') {
      this.props.deleteUserWork(userWorkId);
    } else {
      console.log('deleteUserWork userWorkId type is %s', typeof userWorkId);
    }
  };

  private stopUserWork = (userWorkId: number | string | undefined) => () => {
    if (typeof userWorkId === 'number') {
      this.props.stopUserWork(userWorkId);
    } else {
      console.log('deleteUserWork userWorkId type is %s', typeof userWorkId);
    }
  };
}
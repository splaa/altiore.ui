import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge, Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Field, FieldArray, InjectedFormProps } from 'redux-form';
import { length, required } from 'redux-form-validators';

import { INotification } from '@types';

import { TextField } from '@components/TextField';
import TaskTypeIcon from '@components/@icons/TaskTypeIcon';
import Avatar from '@components/Avatar';
import { SelectMenuField } from '@components/SelectMenuField';
import { StartStopBtn } from '@components/StartStopBtn';

import { parseNumber } from '@store/@common/helpers';
import { STATUS_NAMES } from '@store/projects';

import { PerformerField } from './PerformerField';
import { MembersField } from './MembersField';
import { TextAreaMarkdown } from './TextAreaMarkdown';
import { useStyles } from './styles';

export interface ITaskFormData {
  isDetailsLoaded: boolean;
  id?: number;
  description?: string;
  title?: string;
  typeId?: number;
  projectId: number;
  value: number;
  status: number;
}

export interface ITaskFormProps extends InjectedFormProps<ITaskFormData, ITaskFormProps> {
  archiveTask: any;
  buttonText?: string;
  changeSettings?: any;
  classes?: any;
  fetchTaskDetails: any;
  isCurrent?: boolean;
  location: any;
  onClose: any;
  projectId: number;
  projectTasksIsLoading: boolean;
  push: any;
  replace: any;
  showSuccess: (args: INotification) => any;
  startUserWork?: any;
  stopUserWork: any;
  taskId?: number;
}

const timers: any[] = [];

const titleValidate = [
  required({ msg: 'Обязательное поле' }),
  length({ max: 140, msg: 'Превышен максимум 140 символов' }),
];

export const TaskFormJsx: React.FC<ITaskFormProps> = ({
  archiveTask,
  buttonText = 'Сохранить',
  dirty,
  fetchTaskDetails,
  handleSubmit,
  hasOwnProperty,
  initialValues,
  isCurrent,
  location,
  onClose,
  pristine,
  projectId,
  push,
  replace,
  showSuccess,
  startUserWork,
  stopUserWork,
  submitting,
  taskId,
  valid,
}) => {
  const classes = useStyles();

  const [invisible, setInvisible] = useState([true, true, true, true]);
  useEffect(() => {
    const arr = invisible.slice(0);
    arr.forEach((inv: boolean, i: number) => {
      const timer = setTimeout(() => {
        setInvisible(invisible => [...invisible.slice(0, i), false, ...invisible.slice(i + 1)]);
      }, 500 + i * 500);
      timers.push(timer);
    });
    return () => {
      timers.forEach(timer => {
        clearTimeout(timer);
      });
    };
  }, [invisible, setInvisible, taskId]);

  useEffect(() => {
    if (taskId && !initialValues.isDetailsLoaded) {
      fetchTaskDetails();
    }
  }, [fetchTaskDetails, initialValues, taskId]);

  /** show copy block */
  const [isShownCopy, setIsShowCopy] = useState(false);
  const showCopy = useCallback(() => {
    setIsShowCopy(true);
  }, [setIsShowCopy]);
  const hideCopy = useCallback(() => {
    setIsShowCopy(false);
  }, [setIsShowCopy]);
  /** end show copy block */

  // is this separate page or not?
  const isPage = useMemo(() => {
    return Boolean(location);
  }, [location]);

  const handleClose = useCallback(() => {
    if (isPage) {
      push('/');
    } else {
      onClose();
    }
  }, [isPage, onClose, push]);

  const handleSave = useCallback(
    (isClose: boolean = true) => (e: React.SyntheticEvent) => {
      if (dirty && valid) {
        handleSubmit(e);
      }
      if (isClose && handleClose && valid) {
        handleClose();
      }
    },
    [dirty, handleSubmit, handleClose, valid]
  );

  const getLink = useCallback(
    (absolute: boolean = false) => {
      const path = `/projects/${projectId}/tasks/${taskId}`;
      if (absolute) {
        return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + path;
      }
      return path;
    },
    [projectId, taskId]
  );

  const copyToClipboard = useCallback(
    (e?: React.SyntheticEvent | string) => {
      if (e) {
        if (typeof e === 'string') {
          showSuccess({
            message: 'Ссылка на задачу скопирована в буфер обмена!',
            title: e,
          });
        }
      } else {
        showSuccess({
          message: 'Ссылка на задачу скопирована в буфер обмена!',
          title: getLink(true),
        });
      }
    },
    [getLink, showSuccess]
  );

  const goToTask = useCallback(
    () => (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (isPage) {
        copyToClipboard();
      } else {
        // this.props.changeSettings({ fullScreen: true });
        replace({
          pathname: getLink(false),
        });
      }
    },
    [copyToClipboard, getLink, isPage, replace]
  );

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const moreMenuOpen = useCallback(
    (event: React.SyntheticEvent) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );
  const moreMenuClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);

  const onArchiveTask = useCallback(() => {
    if (handleClose) {
      handleClose();
    }
    archiveTask();
  }, [archiveTask, handleClose]);

  const nullComponent = useCallback(() => null, []);

  const copyText = 'Скопировать ссылку на задачу';

  return (
    <>
      <DialogTitle disableTypography>
        <div className={classes.row}>
          <IconButton>
            <TaskTypeIcon typeId={initialValues.typeId} />
          </IconButton>
          {taskId && (
            <div onMouseLeave={hideCopy}>
              <Tooltip title={isPage ? copyText : 'Открыть в отдельном окне'} placement="bottom">
                <Button variant="text" href={isPage ? undefined : '#'} onClick={goToTask()} onMouseOver={showCopy}>
                  #{taskId}
                </Button>
              </Tooltip>
              {!isPage && isShownCopy && (
                <Tooltip title={copyText} placement="right">
                  <CopyToClipboard text={getLink(true)} onCopy={copyToClipboard}>
                    <IconButton onClick={copyToClipboard}>
                      <FileCopyIcon fontSize="small" />
                    </IconButton>
                  </CopyToClipboard>
                </Tooltip>
              )}
            </div>
          )}
        </div>
        <div>
          {taskId && (
            <>
              <IconButton aria-label="more" className={classes.margin} onClick={moreMenuOpen}>
                <MoreHorizIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={moreMenuClose}>
                <MenuItem onClick={onArchiveTask}>Архивировать задачу</MenuItem>
              </Menu>
            </>
          )}
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className={classes.card}>
        <form onSubmit={handleSave()} className={classes.cardForm}>
          <div className={classes.cardFirst}>
            <Field
              name="title"
              placeholder="Заголовок задачи..."
              component={TextField}
              validate={titleValidate}
              onSubmit={handleSave(false)}
            />
            <Field
              placeholder="Описание задачи..."
              name="description"
              component={TextAreaMarkdown}
              onSave={handleSave(false)}
            />
          </div>
          <div className={classes.cardSecond}>
            <Field
              name="status"
              component={SelectMenuField}
              IconComponent={nullComponent}
              fullWidth
              label="Status"
              type="number"
            >
              {STATUS_NAMES.map((status, i) => (
                <MenuItem key={i} value={i}>
                  {status}
                </MenuItem>
              ))}
            </Field>
            <div>
              <Field name="performer" component={PerformerField} taskId={taskId}>
                {(count: number, onClick: () => void) => <Avatar onClick={onClick}>{count}</Avatar>}
              </Field>
              <FieldArray name="users" component={MembersField} taskId={taskId}>
                {(count: number, onClick: () => void) => (
                  <IconButton aria-label={`${count} members`} className={classes.margin} onClick={onClick}>
                    <Badge badgeContent={count} color="secondary" invisible={invisible[0]}>
                      <GroupAddIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                )}
              </FieldArray>
            </div>

            <Field name="value" component={TextField} parse={parseNumber} label="Оценка задачи" type="number" />
          </div>
          <button style={{ display: 'none' }} type="submit">
            Эта кнопка нужна, чтоб работало сохранение с клавиатуры
          </button>
        </form>
      </DialogContent>
      <DialogActions key={'actions'} className={classes.actions}>
        {isCurrent !== undefined && (
          <StartStopBtn isStarted={isCurrent} onStart={startUserWork} onStop={stopUserWork} />
        )}
        <div className={classes.grow} />
        <Button color="primary" variant="contained" onClick={handleSave()} disabled={submitting || pristine}>
          {buttonText}
          {submitting && '...'}
        </Button>
      </DialogActions>
    </>
  );
};

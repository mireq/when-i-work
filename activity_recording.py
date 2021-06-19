#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime
from pathlib import Path
import fcntl
import os
import signal
import sys
import time

from pynput import keyboard


activity = []


def instance_already_running(label="default"):
	lock = os.open(f"/tmp/activity_recording_{label}.lock", os.O_WRONLY | os.O_CREAT)
	try:
		fcntl.lockf(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
		return False
	except IOError:
		return True


class ActivityLogger(object):
	INACTIVE_TIMEOUT = 60

	def __init__(self):
		self.logfile = open(Path.home() / '.work_log', 'a+')
		if self.logfile.tell() > 0:
			self.logfile.write('\n')
		self.last_recording = datetime.utcnow().replace(microsecond=0)
		self.logfile.write(f'{self.last_recording.isoformat()}')
		self.logfile.flush()
		self.current_activity_time = 0
		signal.signal(signal.SIGINT, self.quit)
		signal.signal(signal.SIGTERM, self.quit)
		signal.signal(signal.SIGHUP, self.quit)

	def on_activity(self, key):
		time = datetime.utcnow().replace(microsecond=0)
		seconds = (time - self.last_recording).seconds
		self.last_recording = time
		self.record_seconds(seconds)

	def start(self):
		try:
			with keyboard.Listener(on_press=self.on_activity) as listener:
				listener.join()
		except KeyboardInterrupt:
			pass
		self.quit()

	def quit(self, *args, **kwargs):
		if self.logfile is not None:
			self.on_activity(None)
			if self.current_activity_time:
				self.logfile.write(f'|1:{self.current_activity_time}')
			self.logfile.close()
		self.logfile = None
		sys.exit(0)

	def record_seconds(self, seconds):
		active = seconds <= self.INACTIVE_TIMEOUT
		if active:
			self.current_activity_time += seconds
		else:
			self.logfile.write(f'|1:{self.current_activity_time}|0:{seconds}')
			self.logfile.flush()
			self.current_activity_time = 0


def main():
	if instance_already_running('mirec'):
		sys.stderr.write("Instance already running\n")
		sys.exit(-1)

	ActivityLogger().start()


if __name__ == "__main__":
	main()

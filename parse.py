#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import traceback
from datetime import datetime, timedelta, timezone
from pathlib import Path
from collections import namedtuple
import json
import locale
import calendar
import locale

import numpy as np
import pytz


DEST_TZ = pytz.timezone('Europe/Bratislava')


TimeRecording = namedtuple('TimeRecording', ['minutes', 'active_days', 'max_value'])


def collect_times(times, divide_by_days=False):
	days = 7 if divide_by_days else 1
	days_recorded = [set() for __ in range(days)]
	recording = [np.zeros((60*24,), dtype=int) for __ in range(days)]
	for start, seconds in times:
		date = start.date()
		day = date.weekday() if divide_by_days else 0
		days_recorded[day].add(start.date())
		end = start + timedelta(seconds=seconds)
		start_minute = start.hour * 60 + start.minute
		end_minute = end.hour * 60 + end.minute
		recording[day][start_minute:end_minute] += 1
	return [
		TimeRecording(recording, len(days_recorded), int(np.max(recording)))
		for recording, days_recorded in zip(recording, days_recorded)
	]


def format_daily_data(time_records):
	if not time_records:
		return {
			'end_date': '1970-01-01',
			'records': []
		}

	first_time = time_records[0][0].date()
	last_time = time_records[-1][0].date()
	days = min((last_time - first_time).days, 365*2)

	time_records = iter(reversed(time_records))
	record = next(time_records)

	recorded_days = []

	for i in range(0, -days, -1):
		date = last_time + timedelta(days=i)
		records = []
		while record[0].date() >= date:
			seconds = int((record[0] - record[0].replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds())
			records.append((seconds, record[1]))
			try:
				record = next(time_records)
			except StopIteration:
				break
		recorded_days.append(sorted(records))

	return {
		'end_date': last_time.strftime('%Y-%m-%d'),
		'records': recorded_days
	}


def main():
	locale.setlocale(locale.LC_ALL, '')
	logfile = open(Path.home() / '.work_log', 'r')
	time_records = []
	for num, row in enumerate(logfile.readlines()):
		try:
			records = row.strip().split('|')
			time = datetime.fromisoformat(records[0]).replace(tzinfo=timezone.utc).astimezone(DEST_TZ)
			records = records[1:]
			records = [[int(v) for v in val.split(':')] for val in records]
			for recording, chunk_time in records:
				if recording:
					start_time = time
					end_time = start_time + timedelta(seconds=chunk_time)
					while end_time.date() > start_time.date():
						end_day = start_time.replace(hour=0, minute=0, second=0) + timedelta(days=1)-timedelta(seconds=1)
						time_records.append((start_time, (end_day-start_time).seconds))
						start_time = end_day + timedelta(seconds=1)
					chunk_time = (end_time - start_time).seconds
					if chunk_time:
						time_records.append((start_time, chunk_time))
				time += timedelta(seconds=chunk_time)
		except Exception:
			sys.stderr.write("Parse error on line %d\n" % (num + 1))
			traceback.print_exc()
			continue

	time_records = sorted(time_records)
	total_report = collect_times(time_records, divide_by_days=False)
	daily_report = collect_times(time_records, divide_by_days=True)

	daily_data = format_daily_data(time_records)

	script_dir = Path(__file__).resolve().parent
	with open(script_dir / 'work_log_template.html', 'r') as tpl_fp:
		template = tpl_fp.read()

	time_reports = []
	for record in total_report:
		time_reports.append({
			'label': 'Celkovo',
			'minutes': [int(minute) for minute in record.minutes],
			'active_days': record.active_days,
			'max_value': record.max_value,
		})

	weekdays = list(calendar.day_name)
	for weekday, record in enumerate(daily_report):
		time_reports.append({
			'label': weekdays[weekday],
			'minutes': [int(minute) for minute in record.minutes],
			'active_days': record.active_days,
			'max_value': record.max_value,
		})

	report_html = template.format(time_reports=json.dumps(time_reports), daily=json.dumps(daily_data))
	with open(script_dir / 'work_log.html', 'w') as fp:
		fp.write(report_html)


if __name__ == "__main__":
	main()

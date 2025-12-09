'use client';

import { bookingSchema } from '@/app/lib/validators';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns';
import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker';
import "react-day-picker/dist/style.css";
import { useForm } from 'react-hook-form'

const BookingForm = ({ event, availability }) => {

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const availableDays = availability.map((day) => new Date(day.date));
  const timeSlots = selectedDate 
  ? availability.find(
    (day) => day.date === format(selectedDate, 'yyyy-MM-dd')
  )?.slots || [] : [];
  return (
    <div>
      <div>
        <div>
          <DayPicker 
          mode='single'
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedTime(null);
          }}
          disabled={[{ before: new Date() }]}
          modifiers={{ available: availableDays }}
          modifiersStyles={{
            available: { 
              backgroundColor: 'lightblue', 
              borderRadius: 100,
            }}}
          />
        </div>
        <div>
          {selectedDate && (
            <div>
              <h3>Available Time Slots</h3>
              <div>
                {timeSlots.map((slot) => {
                  return <Button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  variant={selectedTime === slot ? 'default' : 'outline'}
                  >
                  {slot}</Button>
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div></div>
    </div>
  )
}

export default BookingForm

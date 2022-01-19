import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommandService } from 'src/services/CommandService';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.css'],
})
export class CommandComponent implements OnInit {
  nizKomandi: String[] = [];
  tempControl: FormControl = new FormControl('', Validators.required);
  constructor(private commandService: CommandService) {}

  ngOnInit(): void {
    this.getAllCommands();
  }

  dodajKomandu() {
    if (
      !this.nizKomandi.includes(this.tempControl.value) &&
      this.tempControl.value.trim() != ''
    ) {
      this.nizKomandi.push(this.tempControl.value);
      this.commandService
        .postNewCommand(this.tempControl.value)
        .subscribe(() => {});
    }
  }

  getAllCommands() {
    this.nizKomandi = [];
    this.commandService.getAllCommands().subscribe((commands: String[]) => {
      this.nizKomandi = commands;
    });
  }
}

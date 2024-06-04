import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TopPageComponent } from './top-page/top-page.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FileDropperComponent } from './file-dropper/file-dropper.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SortableItemTileComponent } from './sortable-item-tile/sortable-item-tile.component';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
	declarations: [
		AppComponent,
		TopPageComponent,
		MainMenuComponent,
		GameMenuComponent,
		NewGameComponent,
		LoginPageComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		CommonModule,
		HttpClientModule,
		NgxFileDropModule,
		MatGridListModule,
		MatCardModule,
		MatButtonModule,
		MatListModule,
		MatToolbarModule,
		MatIconModule,
		MatDividerModule,
		FileDropperComponent,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		SortableItemTileComponent
	],
	providers: [CookieService, provideAnimations()],
	bootstrap: [AppComponent]
})
export class AppModule { }
